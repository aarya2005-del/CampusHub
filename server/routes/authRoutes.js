const express = require('express');

const router = express.Router();

const {
  register,
  login,
} = require('../controllers/authController');

// Import rate limiter
const { loginLimiter } = require('../middleware/rateLimiter');

// Register
router.post('/register', register);

// Login with rate limiting
router.post('/login', loginLimiter, login);

module.exports = router;