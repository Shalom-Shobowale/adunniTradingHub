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

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server & Postman
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

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
