import express from "express";

import {
  getPlacements,
  createPlacement,
  updatePlacement,
  deletePlacement,
  applyToPlacement,
} from "../controllers/placementController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Student + Admin can view placements
router.get("/", getPlacements);

// Admin only
router.post("/", protect, adminOnly, createPlacement);
router.put("/:id", protect, adminOnly, updatePlacement);
router.delete("/:id", protect, adminOnly, deletePlacement);

// Student — apply to a placement
router.post("/:id/apply", applyToPlacement);

export default router;
