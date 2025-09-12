import mongoose, { mongo } from "mongoose";

const SpellUseSchema = new mongoose.Schema(
  {
    spell: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spell",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const spellUse = mongoose.model("SpellUse", SpellUseSchema);

export default spellUse;
