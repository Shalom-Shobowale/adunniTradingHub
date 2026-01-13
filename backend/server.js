import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import sendWholesaleEmailRouter from "./sendWholesaleEmail.js";
import sendPaymentEmail from "./sendPaymentEmail.js";
import product from "./routes/product.js";
import order from "./routes/order.js";
import adminOrder from "./routes/adminOrders.js";
import adminUser from "./routes/adminUser.js";
import adminWholesale from "./routes/adminWholesale.js";

dotenv.config();

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

// ---------------- CORS ----------------
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // handle preflight
  }

  next();
});

app.use(bodyParser.json());

// Routes
app.use("/sendWholesaleEmail", sendWholesaleEmailRouter);
app.post("/sendPaymentEmail", sendPaymentEmail);

app.use("/products", product);
app.use("/orders", order);
app.use("/admin/orders", adminOrder);
app.use("/admin/users", adminUser);
app.use("/admin/wholesale", adminWholesale);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
