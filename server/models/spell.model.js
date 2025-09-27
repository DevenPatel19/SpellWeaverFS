import mongoose from "mongoose";

const SpellSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: [
      "Mindfulness",
      "Grounding",
      "Emotional Regulation",
      "Distress Tolerance",
      "Cognitive Restructuring",
      "Self-Compassion",
      "Relaxation",
      "Other"
    ],
    required: true,
  },

  difficulty: {
    type: String,
    enum: ["Easy", "Moderate", "Challenging"],
    default: "Challenging",
  },

  duration: {
    type: Number, // in minutes
    default: 5,
  },

  steps: [
    {
      stepNumber: Number,
      instruction: String,
    },
  ],

  triggers: [
    {
      type: String, // e.g. "Anxiety", "Panic", "Anger", "Stress"
    },
  ],

  tags: [
    {
      type: String, // free-form, e.g. "quick fix", "journalizing", "breathing"
    },
  ],

  resources: [
    {
      type: String, // e.g. link to worksheet, guided audio, or external video
    },
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // therapist/admin/patient who created it
  },

  isPublic: {
    type: Boolean,
    default: false, // can be shared among users
  },

  usageCount: {
    type: Number,
    default: 0, // increment when users practice this skill
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Spell = mongoose.model("Spell", SpellSchema);

export default Spell;
