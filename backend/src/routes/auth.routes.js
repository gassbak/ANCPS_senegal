const express = require("express");

const {
  register,
  login,
  getProfile
} = require("../controllers/auth.controller");
const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.json({
    message: "Accès autorisé",
    userId: req.userId,
    role: req.userRole
  });
});
router.get("/profile", protect, getProfile);
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