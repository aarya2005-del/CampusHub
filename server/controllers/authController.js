
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please fill all fields',
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign(
  {
    email,
    role: "student",
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

    // Temporary response (until MongoDB is connected)
    res.status(201).json({
  message: "User Registered Successfully",
  token,
  user: {
    name,
    email,
  },
});

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
  return res.status(400).json({
    message: "Please fill all fields",
    
  });
 
}

if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }
    const dummyUser = {
  name: "Aarya",
  email: "aarya@gmail.com",
  password: await bcrypt.hash("123456", 10),
};
if (email !== dummyUser.email) {
  return res.status(404).json({
    message: "User not found",
  });
}
const isMatch = await bcrypt.compare(password, dummyUser.password);

if (!isMatch) {
  return res.status(401).json({
    message: "Invalid credentials",
  });
}
const token = jwt.sign(
  {
    email: dummyUser.email,
    role: "student",
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

    console.log(email);
    console.log(password);

    res.status(200).json({
  message: "Login Successful",
  token,
  user: {
    name: dummyUser.name,
    email: dummyUser.email,
  },
});

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};