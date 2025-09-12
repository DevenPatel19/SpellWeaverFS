import User from "../models/user.model.js";
import Spell from "../models/spell.model.js";

// GET patient profile (self or by admin/therapist)
export const getPatient = async (req, res) => {
  try {
    const patientId = req.params.id;

    const patient = await User.findById(patientId)
      .select("-password")
      .populate("patientProfile.therapist", "name email")
      .populate("patientProfile.spellsPracticed.spell", "name description");

    if (!patient || patient.role !== "patient") {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Patients can only view their own profile
    if (req.user.role === "patient" && req.user.userId !== patientId) {
      return res.status(403).json({
        success: false,
        message: "Patients can only access their own profile",
      });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    console.error("getPatient error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE patient profile (self or admin)
export const updatePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const updates = req.body;

    // Patients can only update their own profile
    if (req.user.role === "patient" && req.user.userId !== patientId) {
      return res.status(403).json({
        success: false,
        message: "Patients can only update their own profile",
      });
    }

    const patient = await User.findByIdAndUpdate(
      patientId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!patient || patient.role !== "patient") {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    console.error("updatePatient error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH practice a spell
export const practiceSpell = async (req, res) => {
  try {
    const { patientId, spellId } = req.params;

    // Patients can only practice spells for themselves
    if (req.user.role === "patient" && req.user.userId !== patientId) {
      return res.status(403).json({
        success: false,
        message: "Patients can only practice spells for themselves",
      });
    }

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Update spellsPracticed
    const spellIndex = patient.patientProfile.spellsPracticed.findIndex(
      (s) => s.spell.toString() === spellId
    );

    if (spellIndex >= 0) {
      patient.patientProfile.spellsPracticed[spellIndex].timesPracticed += 1;
      patient.patientProfile.spellsPracticed[spellIndex].lastPracticedAt = new Date();
    } else {
      patient.patientProfile.spellsPracticed.push({
        spell: spellId,
        timesPracticed: 1,
        lastPracticedAt: new Date(),
      });
    }

    await patient.save();

    res.json({
      success: true,
      message: "Spell practiced successfully",
      data: patient.patientProfile.spellsPracticed,
    });
  } catch (error) {
    console.error("practiceSpell error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
