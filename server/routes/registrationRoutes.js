const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const {
  registerForEvent,
  getMyRegisteredEvents,
  getEventAnalytics,
  getAllEventAnalytics,
  getEventRegistrations,
  removeEventRegistration,
} = require('../controllers/registrationController');

// ================= REGISTER FOR EVENT =================
router.post(
  '/register',
  authMiddleware,
  adminMiddleware,
  registerForEvent
);

// ================= STUDENT'S REGISTERED EVENTS =================
router.get(
  '/my-events/:studentId',
  authMiddleware,
  getMyRegisteredEvents
);

// ================= ALL EVENT ANALYTICS =================
router.get(
  '/analytics',
  authMiddleware,
  adminMiddleware,
  getAllEventAnalytics
);

// ================= EVENT REGISTRATIONS =================
router.get(
  '/event/:eventId',
  authMiddleware,
  adminMiddleware,
  getEventRegistrations
);

// ================= SINGLE EVENT ANALYTICS =================
router.get(
  '/analytics/:eventId',
  authMiddleware,
  adminMiddleware,
  getEventAnalytics
);
// ================= REMOVE EVENT REGISTRATION =================
router.delete(
  "/:registrationId",
  authMiddleware,
  adminMiddleware,
  removeEventRegistration
);
module.exports = router;