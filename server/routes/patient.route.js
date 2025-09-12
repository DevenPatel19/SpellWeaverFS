import express from "express";
import {
  getPatient,
  updatePatient,
  practiceSpell,
} from "../controllers/patient.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// All patient routes require authentication
router.use(protect);

// Get patient profile
router.get("/:id", authorize("admin", "therapist", "patient"), getPatient);

// Update patient profile
router.put("/:id", authorize("admin", "patient"), updatePatient);

// Practice a spell
router.patch(
  "/:patientId/practice-spell/:spellId",
  authorize("patient"),
  practiceSpell
);

export default router;
