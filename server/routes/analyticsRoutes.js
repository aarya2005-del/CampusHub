const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const {
  getStudentsByDepartment,
  getStudentsByYear,
  getEventsPerMonth,
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

module.exports = router;