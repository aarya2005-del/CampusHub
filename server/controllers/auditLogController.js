const AuditLog = require("../models/AuditLog");

// Admin: view audit logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(200);

    return res.status(200).json({
      total: logs.length,
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};