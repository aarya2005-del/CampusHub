const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const {
  register,
  login,
  createStudentAccount,
} = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Authentication]
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/register', register);
router.post(
  '/create-student-account',
  authMiddleware,
  adminMiddleware,
  createStudentAccount
);
module.exports = router;