import express from "express";
import {
  getTherapist,
  getAssignedPatients,
  getSpellAnalytics,
  assignTherapist,
} from "../controllers/therapist.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Therapist profile
router.get("/:id", getTherapist);

// Assigned patients
router.get("/:id/patients", authorize("therapist", "admin"), getAssignedPatients);

// Spell analytics
router.get("/:id/analytics", authorize("therapist", "admin"), getSpellAnalytics);

// Admin: assign therapist to patient
router.patch(
  "/assign/:patientId",
  authorize("therapist","admin"),
  (req, res) => assignTherapist({ ...req, params: { ...req.params, therapistId: req.body.therapistId } }, res)
);

export default router;
