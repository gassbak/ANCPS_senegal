const AuditLog =
  require("../models/AuditLog");

const createAuditLog = async (data) => {
  return AuditLog.create(data);
};

module.exports = {
  createAuditLog
};