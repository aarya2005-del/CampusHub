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
  getAttendanceReport,
} = require(
  "../controllers/reportController"
);

router.get(
  "/students",
  authMiddleware,
  adminMiddleware,
  getStudentReport
);
router.get(
  "/attendance",
  authMiddleware,
  adminMiddleware,
  getAttendanceReport
);
module.exports = router;