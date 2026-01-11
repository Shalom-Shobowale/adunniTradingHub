import express from "express";
import {
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/ordersController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", requireAuth, requireAdmin, getOrders);
router.put("/:id", requireAuth, requireAdmin, updateOrderStatus);
router.put("/:id/payment", requireAuth, requireAdmin, updatePaymentStatus);

export default router;
