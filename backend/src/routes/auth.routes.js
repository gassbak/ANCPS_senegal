
const express = require("express");

const {
  register,
  login,
  getProfile
} = require("../controllers/auth.controller");

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const router = express.Router();


// Inscription
router.post("/register", register);


// Connexion
router.post("/login", login);


// Utilisateur connecté
router.get("/me", protect, (req, res) => {
  res.json({
    message: "Accès autorisé",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});


// Profil
router.get("/profile", protect, getProfile);


// Test admin
router.get(
  "/admin-test",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Accès admin autorisé"
    });
  }
);


module.exports = router;
