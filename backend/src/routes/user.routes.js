const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  updateRole,
  deleteUser,
} = require("../controllers/user.controller");
const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.put("/:id/role", updateRole);
router.delete("/:id", deleteUser);

module.exports = router;