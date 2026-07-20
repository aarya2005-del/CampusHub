const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const {
  getDashboardStats,
} = require('../controllers/dashboardController');

// Admin Dashboard Stats
router.get(
  '/stats',
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

module.exports = router;