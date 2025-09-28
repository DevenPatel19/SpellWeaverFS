import Spell from "../models/spell.model.js";
import User from "../models/user.model.js";
import SpellUser from "../models/spellUser.model.js";

export const createSpell = async (req, res) => {
    const { name, description, category, } = req.body;
  const spell = await Spell.create({ name, description, category, createdBy: req.user.id });
  res.status(201).json(spell);
}

export const getAllSpells = async (req, res) => {
    const spells = await Spell.find();
    res.status(200).json(spells);
}

export const getMySpells = async (req, res) => {
    const spells = await Spell.find({ createdBy: req.user.id });
    res.status(200).json(spells);
}

export const getSpell = async (req, res) => { 
    const spell = await Spell.findById(req.params.id);
    if (!spell) {
        return res.status(404).json({ message: "Spell not found" });
    }
    res.status(200).json(spell);
}

export const updateSpell = async (req, res) => {
    const spell = await Spell.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!spell) {
        return res.status(404).json({ message: "Spell not found" });
    }
    res.status(200).json(spell);
}   

export const deleteSpell = async (req, res) => {
    const spell = await Spell.findByIdAndDelete(req.params.id);
    if (!spell) {
        return res.status(404).json({ message: "Spell not found" });
    } 
    res.status(200).json({ message: "Spell deleted" });
}   


export const useSpell = async (req, res) => {
    try {
        const { context, effectiveness, notes } = req.body;
        
        // Check if spell exists
        const spell = await Spell.findById(req.params.id);
        if (!spell) {
            return res.status(404).json({ message: "Spell not found" });
        }

        // Create a new SpellUse record
        const spellUse = await SpellUse.create({
            spell: req.params.id,
            user: req.user.id,
            context: context || "",
            effectiveness: effectiveness || "Somewhat Effective",
            notes: notes || "",
            usedAt: new Date()
        });

        // Populate the spell details in the response
        const populatedSpellUse = await SpellUse.findById(spellUse._id)
            .populate('spell', 'name description category')
            .populate('user', 'username email');

        res.status(201).json({
            message: `Spell ${spell.name} used successfully!`,
            spellUse: populatedSpellUse
        });

    } catch (error) {
        console.error("Error using spell:", error);
        res.status(500).json({ message: "Error using spell", error: error.message });
    }
}   

export const shareSpell = async (req, res) => {}