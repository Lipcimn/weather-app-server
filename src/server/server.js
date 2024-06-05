import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const lang = "pt";

app.use(cors());
app.use(express.json());

app.post("/post", async (req, res) => {
  const cityName = req.body.cityName;
  try {
    const geocodeResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
    );
    const cityGeocodeData = geocodeResponse.data;
    const weatherDataResponse = cityGeocodeData.map(async (city) => {
      if (city) {
        const cityWeatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${
            city.lat
          }&lon=${city.lon}&appid=${API_KEY}&units=metric&lang=${lang || "en"}`
        );
        console.log(cityWeatherResponse.data);
        return {
          cityName: cityWeatherResponse.data.name,
          coord: cityWeatherResponse.data.coord,
          weather: cityWeatherResponse.data.weather,
          main: cityWeatherResponse.data.main,
          wind: cityWeatherResponse.data.wind,
        };
      } else {
        console.log("No city found");
        return {
          error: "No city found",
        };
      }
    });
    const weatherDataArray = await Promise.all(weatherDataResponse);
    res.json(weatherDataArray);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
