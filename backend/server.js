import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sendWholesaleEmailRouter from "./sendWholesaleEmail.js";
import sendPaymentEmail from "./sendPaymentEmail.js";
import product from "./routes/product.js";
import order from "./routes/order.js";
import adminOrder from "./routes/adminOrders.js";
import adminUser from "./routes/adminUser.js";
import adminWholesale from "./routes/adminWholesale.js";

dotenv.config();

const app = express();
app.use(express.json());

// Allowed frontend origins

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://adunnitradinghub.com",
  "https://www.adunnitradinghub.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

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
