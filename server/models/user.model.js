import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "patient", "therapist"],
      required: true,
      default: "patient",
    },
    avatarUrl: String,
    dateOfBirth: Date,
    
    // Common gamification fields
    level: { type: Number, default: 1 },
    experiencePoints: { type: Number, default: 0 },
    
    // Patient-specific fields
    patientProfile: {
      energyLevel: { type: Number, default: 100 },
      currentQuests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quest" }],
      completedQuests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quest" }],
      spellsPracticed: [
        {
          spell: { type: mongoose.Schema.Types.ObjectId, ref: "Spell" },
          timesPracticed: { type: Number, default: 0 },
          lastPracticedAt: Date,
        },
      ],
      therapist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      streakDays: { type: Number, default: 0 },
      lastLogin: { type: Date, default: Date.now },
      preferredQuestCategories: [String],
      notificationPreferences: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
      },
    },
    
    // Therapist-specific fields
    therapistProfile: {
      title: {
        type: String,
        enum: ["Therapist", "Mage", "Counselor", "Guide", "Healer"],
        default: "Therapist",
      },
      biography: String,
      licenseNumber: { type: String, unique: true, sparse: true },
      specialization: [String],
      experienceYears: { type: Number, min: 0, default: 0 },
      sessionTypes: [String],
      magicalApproach: { type: String, default: "Healing Magic" },
      assignedQuests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quest" }],
      rating: { type: Number, min: 0, max: 5, default: 0 },
      reviews: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          comment: String,
          rating: { type: Number, min: 0, max: 5 },
          date: { type: Date, default: Date.now },
        },
      ],
      availability: [String],
      contactEmail: String,
    },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// Hash password before saving
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);