const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateRole,
  updatePermissions
} = require("../controllers/user.controller");

const protect = require("../middlewares/auth.middleware");
const requirePermission = require("../middlewares/permission.middleware");

const router = express.Router();


// Voir tous les utilisateurs
router.get(
  "/",
  protect,
  requirePermission("users.view"),
  getUsers
);


// Ajouter un utilisateur
router.post(
  "/",
  protect,
  requirePermission("users.create"),
  createUser
);


// Voir un utilisateur
router.get(
  "/:id",
  protect,
  requirePermission("users.view"),
  getUser
);


// Modifier le rôle
router.put(
  "/:id/role",
  protect,
  requirePermission("users.manage_roles"),
  updateRole
);


// Modifier les permissions
router.put(
  "/:id/permissions",
  protect,
  requirePermission("users.manage_permissions"),
  updatePermissions
);


module.exports = router;