const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const {
  getStudentsByDepartment,
  getStudentsByYear,
  getEventsPerMonth,
  getOverallAttendance,
  getAttendanceTrend,
} = require('../controllers/analyticsController');
// Students by Department
router.get(
  '/students-by-department',
  authMiddleware,
  adminMiddleware,
  getStudentsByDepartment
);

// Students by Year
router.get(
  '/students-by-year',
  authMiddleware,
  adminMiddleware,
  getStudentsByYear
);

// Events Per Month
router.get(
  '/events-per-month',
  authMiddleware,
  adminMiddleware,
  getEventsPerMonth
);
// Overall Attendance
router.get(
  '/attendance',
  authMiddleware,
  adminMiddleware,
  getOverallAttendance
);
router.get(
  '/attendance-trend',
  authMiddleware,
  adminMiddleware,
  getAttendanceTrend
);
module.exports = router;