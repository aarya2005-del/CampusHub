const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


const {
  markAttendance,
  getStudentAttendance,
  getAttendanceAnalytics,
  getAttendanceByDate,
  getMyAttendance,
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
  adminMiddleware,
  getAttendanceByDate
);
// Logged-in student's own subject-wise attendance
router.get(
  '/me',
  authMiddleware,
  getMyAttendance
);
// Get attendance for a student
router.get(
  '/student/:studentId',
  authMiddleware,
  adminMiddleware,
  getStudentAttendance
);


// Get attendance analytics
router.get(
  '/analytics/:studentId',
  authMiddleware,
  adminMiddleware,
  getAttendanceAnalytics
);

module.exports = router;