import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sendWholesaleEmailRouter from "./sendWholesaleEmail.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000" // change if your frontend runs somewhere else
}));
app.use(bodyParser.json());

// Mount the route
app.use("/sendWholesaleEmail", sendWholesaleEmailRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
