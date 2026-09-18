const facultyAdminMiddleware = (req, res, next) => {
  if (
    req.user.role !== "admin" &&
    req.user.role !== "faculty"
  ) {
    return res.status(403).json({
      message:
        "Access denied. Faculty or admin only.",
    });
  }

  next();
};

module.exports = facultyAdminMiddleware;