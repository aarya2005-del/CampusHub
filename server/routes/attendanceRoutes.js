const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


const {
  markAttendance,
  getStudentAttendance,
  getAttendanceAnalytics,
} = require('../controllers/attendanceController');
// ================= MARK ATTENDANCE =================
// Only faculty/admin can mark attendance
// Mark attendance (Admin only)
router.post(
  '/mark',
  authMiddleware,
  adminMiddleware,
  markAttendance
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