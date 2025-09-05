import User from "../models/user.model.js";

// Get all users (admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  res.json({ message: "This route is under construction." });
};

// Get single user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    // Remove password from update data
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Assign therapist to patient
export const assignTherapist = async (req, res) => {
  try {
    const { patientId, therapistId } = req.params;

    const patient = await User.findOne({
      _id: patientId,
      role: "patient",
    });

    const therapist = await User.findOne({
      _id: therapistId,
      role: "therapist",
    });

    if (!patient || !therapist) {
      return res.status(404).json({
        success: false,
        message: "Patient or therapist not found",
      });
    }

    patient.patientProfile.therapist = therapistId;
    await patient.save();

    res.json({
      success: true,
      message: "Therapist assigned successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};