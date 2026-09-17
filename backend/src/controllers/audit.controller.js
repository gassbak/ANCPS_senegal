const AuditLog =
  require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
  try {
    const logs =
      await AuditLog.find()
        .populate(
          "utilisateur",
          "-password"
        )
        .sort({
          createdAt: -1
        });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getAuditLog = async (req, res) => {
  try {
    const log =
      await AuditLog.findById(
        req.params.id
      ).populate(
        "utilisateur",
        "-password"
      );

    if (!log) {
      return res.status(404).json({
        message: "Historique introuvable"
      });
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAuditLogs,
  getAuditLog
};