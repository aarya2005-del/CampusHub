const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const adminMiddleware = require(
  "../middleware/adminMiddleware"
);

const {
  getAuditLogs,
} = require("../controllers/auditLogController");

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAuditLogs
);

module.exports = router;