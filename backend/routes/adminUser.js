import express from "express";
import {
  getProfiles,
  toggleWholesaleApproval,
} from "../controllers/profileController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", requireAuth, requireAdmin, getProfiles);
router.put("/:id", requireAuth, requireAdmin, toggleWholesaleApproval);

export default router;
