const bcrypt = require("bcryptjs");
const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    res.json(await User.find().select("-password"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Cet email existe déjà" });
    }
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, updateRole, deleteUser };