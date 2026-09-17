const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { jwtSecret } = require("../config/env");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token manquant"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.id);

    req.userId = user._id;
    req.userRole = user.role;

    next();

  } catch (error) {
    res.status(401).json({
      message: "Token invalide"
    });
  }
};

module.exports = protect;