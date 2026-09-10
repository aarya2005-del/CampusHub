const User = require("../models/User");
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    

    const { name, email } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Make sure another account is not using this email
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already in use",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name.trim(),
        email: normalizedEmail,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.getAdminDashboard = (req, res) => {
  res.status(200).json({
    message: "Welcome to Admin Dashboard",
  });
};