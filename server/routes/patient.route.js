import express from "express";
import {
  getPatient,
  updatePatient,
  practiceSpell,
} from "../controllers/patient.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get a patient profile (self, therapist of patient, or admin)
router.get("/:id", getPatient);

// Update a patient profile (self or admin)
router.put("/:id", updatePatient);

// Patient practices a spell
router.patch("/:patientId/practice/:spellId", authorize("patient", "admin"), practiceSpell);

export default router;
