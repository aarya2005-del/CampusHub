exports.getProfile = (req, res) => {
  res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user,
  });
};

exports.getAdminDashboard = (req, res) => {
  res.status(200).json({
    message: "Welcome to Admin Dashboard",
  });
};