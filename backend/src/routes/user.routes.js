const express = require("express");

const {
  getUsers,
  getUser,
  updateRole,
  updatePermissions
} = require("../controllers/user.controller");
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


// Voir les utilisateurs
router.get(
  "/",
  protect,
  requirePermission("users.view"),
  getUsers
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
router.post(
  "/",
  protect,
  requirePermission("users.create"),
  createUser
);

// Modifier les permissions
router.put(
  "/:id/permissions",
  protect,
  requirePermission("users.manage_permissions"),
  updatePermissions
);


module.exports = router;