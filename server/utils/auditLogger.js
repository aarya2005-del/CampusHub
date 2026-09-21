const AuditLog = require("../models/AuditLog");

const logAudit = async ({
  user,
  action,
  resourceType,
  resourceId = null,
  details = "",
}) => {
  try {
    await AuditLog.create({
      user,
      action,
      resourceType,
      resourceId,
      details,
    });
  } catch (error) {
    console.error(
      "Audit log error:",
      error.message
    );
  }
};

module.exports = logAudit;