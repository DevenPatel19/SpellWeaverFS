import express from "express";
import {
  getTherapist,
  getAssignedPatients,
  getSpellAnalytics,
} from "../controllers/therapist.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// All therapist routes require authentication
router.use(protect);

// Get therapist profile
router.get("/:id", authorize("admin", "therapist"), getTherapist);

// Get assigned patients
router.get("/:id/patients", authorize("admin", "therapist"), getAssignedPatients);

// Get spell analytics for assigned patients
router.get("/:id/spell-analytics", authorize("admin", "therapist"), getSpellAnalytics);

export default router;
