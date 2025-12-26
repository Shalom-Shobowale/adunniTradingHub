import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sendWholesaleEmailRouter from "./sendWholesaleEmail.js";
import process from "process";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mount your route
app.use("/sendWholesaleEmail", sendWholesaleEmailRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
