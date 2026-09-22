const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

const asyncHandler = require('../utils/asyncHandler');

const {
registerSchema,
loginSchema,
} = require('../validations/authValidation');

const {
successResponse,
errorResponse,
} = require('../utils/apiResponse');

// ================= REGISTER =================
exports.register = asyncHandler(async (req, res, next) => {
// Joi validation
const { error } = registerSchema.validate(req.body);

if (error) {
return next(error);
}

const { name, email, password } = req.body;

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
  {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
);
});

// ================= LOGIN =================
exports.login = asyncHandler(async (req, res, next) => {
// Joi validation
const { error } = loginSchema.validate(req.body);

if (error) {
return next(error);
}

const { email, password } = req.body;

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
const isMatch = await bcrypt.compare(
password,
user.password
);

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
  {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
);
});

// ================= CREATE STUDENT ACCOUNT =================
exports.createStudentAccount = asyncHandler(async (req, res) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    return errorResponse(
      res,
      400,
      'Student and password are required'
    );
  }

  if (password.length < 6) {
    return errorResponse(
      res,
      400,
      'Password must be at least 6 characters'
    );
  }

  const student = await Student.findById(studentId);

  if (!student) {
    return errorResponse(
      res,
      404,
      'Student not found'
    );
  }

  if (student.user) {
    return errorResponse(
      res,
      409,
      'Student already has a login account'
    );
  }

  const existingUser = await User.findOne({
    email: student.email,
  });

  if (existingUser) {
    return errorResponse(
      res,
      409,
      'A user with this email already exists'
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: student.name,
    email: student.email,
    password: hashedPassword,
    role: 'student',
  });

  student.user = user._id;
  await student.save();

  return successResponse(
    res,
    201,
    'Student login account created successfully',
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      studentId: student._id,
    }
  );
});