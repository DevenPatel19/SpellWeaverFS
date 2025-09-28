import User from "../models/user.model.js";
import Spell from "../models/spell.model.js";

// GET therapist profile (self or admin)
export const getTherapist = async (req, res) => {
  try {
    const therapistId = req.params.id;

    const therapist = await User.findById(therapistId)
      .select("-password")
      .populate("therapistProfile.assignedQuests", "name description")
      .populate({
        path: "therapistProfile.reviews.user",
        select: "name email",
      });

    if (!therapist || therapist.role !== "therapist") {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    // Therapists can only view their own profile
    if (req.user.role === "therapist" && req.user.userId !== therapistId) {
      return res.status(403).json({
        success: false,
        message: "Therapists can only access their own profile",
      });
    }

    res.json({ success: true, data: therapist });
  } catch (error) {
    console.error("getTherapist error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update therapist profile (self or admin)
export const updateTherapist = async (req, res) => {}

// GET assigned patients
export const getAssignedPatients = async (req, res) => {
  try {
    const therapistId = req.params.id;

    // Only self or admin can view
    if (req.user.role === "therapist" && req.user.userId !== therapistId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these patients",
      });
    }

    const patients = await User.find({
      role: "patient",
      "patientProfile.therapist": therapistId,
    }).select("-password");

    res.json({ success: true, data: patients });
  } catch (error) {
    console.error("getAssignedPatients error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET spell analytics for assigned patients
export const getSpellAnalytics = async (req, res) => {
  try {
    const therapistId = req.params.id;

    // Only self or admin
    if (req.user.role === "therapist" && req.user.userId !== therapistId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this data",
      });
    }

    const patients = await User.find({
      role: "patient",
      "patientProfile.therapist": therapistId,
    }).select("name patientProfile.spellsPracticed");

    const analytics = {};

    patients.forEach((patient) => {
      patient.patientProfile.spellsPracticed.forEach((s) => {
        const spellId = s.spell.toString();
        if (!analytics[spellId]) {
          analytics[spellId] = { timesPracticed: 0, patientCount: 0 };
        }
        analytics[spellId].timesPracticed += s.timesPracticed;
        analytics[spellId].patientCount += 1;
      });
    });

    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error("getSpellAnalytics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign a therapist to a patient (admin-only)
export const assignTherapist = async (req, res) => {
  try {
    const { patientId, therapistId } = req.params;

    const patient = await User.findById(patientId);
    const therapist = await User.findById(therapistId);

    if (!patient || patient.role !== "patient") {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (!therapist || therapist.role !== "therapist") {
      return res.status(404).json({
        success: false,
        message: "Therapist not found",
      });
    }

    // Assign therapist
    patient.patientProfile.therapist = therapistId;
    await patient.save();

    res.json({
      success: true,
      message: `Therapist ${therapist.name} assigned to patient ${patient.name}`,
      data: patient,
    });
  } catch (error) {
    console.error("assignTherapist error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};