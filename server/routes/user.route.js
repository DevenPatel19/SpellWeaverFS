import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  assignTherapist,
} from "../controllers/user.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/", authorize("admin"), getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", authorize("admin"), deleteUser);
router.patch(
  "/:patientId/assign-therapist/:therapistId",
  authorize("admin"),
  assignTherapist
);

export default router;