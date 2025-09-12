import Spell from "../models/spell.model.js";
import User from "../models/user.model.js";

export const createSpell = async (req, res) => {
    const { name, description, category, } = req.body;
  const spell = await Spell.create({ name, description, category, createdBy: req.user.id });
  res.status(201).json(spell);
}

export const getAllSpells = async (req, res) => {}

export const getSpell = async (req, res) => {}

export const updateSpell = async (req, res) => {}   

export const deleteSpell = async (req, res) => {}   

export const getMySpells = async (req, res) => {}

export const useSpell = async (req, res) => {
   
}   

export const shareSpell = async (req, res) => {}