const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


const {
  markAttendance,
  getStudentAttendance,
  getAttendanceAnalytics,
  getAttendanceByDate,
} = require("../controllers/attendanceController");
// ================= MARK ATTENDANCE =================
// Only faculty/admin can mark attendance
// Mark attendance (Admin only)
router.post(
  '/mark',
  authMiddleware,
  adminMiddleware,
  markAttendance
);
router.get(
  "/date",
  authMiddleware,
  getAttendanceByDate
);
// Get attendance for a student
router.get(
  '/student/:studentId',
  authMiddleware,
  getStudentAttendance
);


// Get attendance analytics
router.get(
  '/analytics/:studentId',
  authMiddleware,
  getAttendanceAnalytics
);

module.exports = router;