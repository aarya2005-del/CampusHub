const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
{ token, user }
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
{ token, user }
);
});