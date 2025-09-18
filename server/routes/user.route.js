import express from "express";
import {
  getUsers,
  deleteUser,
  assignTherapist,
} from "../controllers/user.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin: get all users
router.get("/", authorize("admin"), getUsers);

// Admin: delete a user
router.delete("/:id", authorize("admin"), deleteUser);

// Admin: assign a therapist to a patient
router.patch(
  "/:patientId/assign-therapist/:therapistId",
  authorize("admin"),
  assignTherapist
);

export default router;
