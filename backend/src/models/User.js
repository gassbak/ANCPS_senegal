const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: [
      "superadmin",
      "admin",
      "editor",
      "verifier",
      "etablissement",
      "visiteur"
    ],
    default: "visiteur"
  },

  permissions: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("User", userSchema);