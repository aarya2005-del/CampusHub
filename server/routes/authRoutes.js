const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');

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

module.exports = router;