const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getProfile,
  getAdminDashboard,
} = require("../controllers/userController");

router.get("/profile", authMiddleware, getProfile);

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAdminDashboard
);

module.exports = router;