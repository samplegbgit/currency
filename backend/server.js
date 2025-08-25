import axios from "axios";
import express from "express";
import { config } from "dotenv";
import cors from "cors";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/convert", async (req, res) => {
  const { base_currency, currencies } = req.query;

  try {
    const url = `https://api.freecurrencyapi.com/v1/latest?apiKey=${process.env.API_KEY}&base_currency=${base_currency}&currencies=${currencies}`;
    console.log("SENDING REQUEST");
    const response = await axios.get(url, {
      headers: { apikey: process.env.API_KEY },
    });
    console.log("REQUEST SENT");
    console.log(response);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message, error.response?.data);
    res.status(500).json({
      message: "Error fetching data",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
