const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    action: {
      type: String,
      required: true,
      trim: true
    },

    entite: {
      type: String,
      required: true,
      trim: true
    },

    entiteId: {
      type: mongoose.Schema.Types.ObjectId
    },

    details: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "AuditLog",
  auditLogSchema
);