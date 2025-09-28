import mongoose, { mongo } from "mongoose";

const SpellUseSchema = new mongoose.Schema(
  {
    spell: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spell",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    context: String, // e.g. "Feeling anxious before a presentation"
    effectiveness: {
      type: String,
      enum: ["Not Effective", "Somewhat Effective", "Very Effective"],
    },
    notes: String, // user's reflections or therapist's feedback
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const spellUse = mongoose.model("SpellUse", SpellUseSchema);

export default spellUse;
