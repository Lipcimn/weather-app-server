import express, { response, text } from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());

app.get("/", async (req, res) => {
  try {
    const city = "London"
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=${API_KEY}}`
    );
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
