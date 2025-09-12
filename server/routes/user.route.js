import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  assignTherapist,
} from "../controllers/user.controller.js";
import { getMe } from "../controllers/auth.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();


router.use(protect);
router.get("/", authorize("admin"), getUsers);
router.get("/:id", authorize("admin", "therapist", "patient"), getUser);
router.put("/:id", authorize("admin", "patient"), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);
router.patch(
  "/:patientId/assign-therapist/:therapistId",
  authorize("admin"),
  assignTherapist
);

export default router;