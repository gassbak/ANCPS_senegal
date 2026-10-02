const User = require("../models/User");
const permissions = require("../config/permissions");

// Voir tous les utilisateurs
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password");

    res.json(users);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
};


// Voir un utilisateur
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    res.json(user);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
};


// Modifier le rôle
const updateRole = async (req, res) => {
  try {
    const { role } = req.body;

    const roles = [
      "superadmin",
      "admin",
      "editor",
      "verifier",
      "etablissement",
      "visiteur"
    ];

    if (!roles.includes(role)) {
      return res.status(400).json({
        message: "Rôle invalide"
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    user.role = role;

    await user.save();

    res.json({
      message: "Rôle modifié avec succès",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
};


// Modifier les permissions
const updatePermissions = async (req, res) => {
  try {
    const { permissions: newPermissions } = req.body;

    if (!Array.isArray(newPermissions)) {
      return res.status(400).json({
        message: "Les permissions doivent être un tableau"
      });
    }

    // Vérifier que les permissions existent
    const invalidPermissions = newPermissions.filter(
      permission => !permissions.includes(permission)
    );

    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        message: "Permission(s) invalide(s)",
        invalidPermissions
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    user.permissions = newPermissions;

    await user.save();

    res.json({
      message: "Permissions modifiées avec succès",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
};


module.exports = {
  getUsers,
  getUser,
  updateRole,
  updatePermissions
};