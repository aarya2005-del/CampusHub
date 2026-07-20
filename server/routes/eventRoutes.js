const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createEvent,
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
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
// Get Upcoming Events
router.get(
  '/upcoming',
  authMiddleware,
  getUpcomingEvents
);
// Get Past Events
router.get(
  '/past',
  authMiddleware,
  getPastEvents
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