const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// Create Event (Admin only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createEvent
);

// Get All Events
router.get(
  "/",
  authMiddleware,
  getAllEvents
);

// Get Event By ID
router.get(
  "/:id",
  authMiddleware,
  getEventById
);

// Update Event (Admin only)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateEvent
);

// Delete Event (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteEvent
);

module.exports = router;