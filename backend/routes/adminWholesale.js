import express from "express";
import {
  getWholesale,
  createWholesale,
  updateWholesale,
  deleteWholesale,
} from "../controllers/wholesaleController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();
router.use(requireAuth, requireAdmin);


router.get("/", getWholesale);
router.post("/", createWholesale);
router.put("/:id", updateWholesale);
router.delete("/:id", deleteWholesale);

export default router;



