const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const adminMiddleware = require(
  "../middleware/adminMiddleware"
);

const {
  getStudentReport,
} = require(
  "../controllers/reportController"
);

router.get(
  "/students",
  authMiddleware,
  adminMiddleware,
  getStudentReport
);

module.exports = router;