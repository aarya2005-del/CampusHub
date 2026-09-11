const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  getAdminDashboard,
} = require("../controllers/userController");

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAdminDashboard
);

module.exports = router;