const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require(
  "../controllers/notificationController"
);

// Get logged-in user's notifications
router.get(
  "/me",
  authMiddleware,
  getMyNotifications
);

// Mark all as read
router.patch(
  "/read-all",
  authMiddleware,
  markAllAsRead
);

// Mark one as read
router.patch(
  "/:id/read",
  authMiddleware,
  markAsRead
);

module.exports = router;