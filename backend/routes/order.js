import express from "express";
import {
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
  createOrder
} from "../controllers/ordersController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getMyOrders } from "../controllers/ordersController.js";

const router = express.Router();

router.get("/my-orders", requireAuth, requireAdmin, getMyOrders);
router.put("/:id", requireAuth, requireAdmin, updateOrderStatus);
router.put("/:id/payment", requireAuth, requireAdmin, updatePaymentStatus);
router.post("/create", createOrder);

export default router;
