const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const {
  successResponse,
  errorResponse,
} = require('../utils/apiResponse');

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return errorResponse(
        res,
        400,
        'Please fill all fields'
      );
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return errorResponse(
        res,
        400,
        'Invalid email'
      );
    }

    // Validate password length
    if (password.length < 6) {
      return errorResponse(
        res,
        400,
        'Password must be at least 6 characters'
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return errorResponse(
        res,
        400,
        'User already exists'
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return successResponse(
      res,
      201,
      'User Registered Successfully',
      { token, user }
    );

  } catch (error) {
    return errorResponse(
      res,
      500,
      error.message
    );
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
      return errorResponse(
        res,
        400,
        'Please fill all fields'
      );
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return errorResponse(
        res,
        400,
        'Invalid email'
      );
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(
        res,
        404,
        'User not found'
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(
        res,
        401,
        'Invalid credentials'
      );
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return successResponse(
      res,
      200,
      'Login Successful',
      { token, user }
    );

  } catch (error) {
    return errorResponse(
      res,
      500,
      error.message
    );
  }
};