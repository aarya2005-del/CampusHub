exports.getProfile = (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user,
  });
};