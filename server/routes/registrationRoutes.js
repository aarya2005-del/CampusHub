const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');


const {
  registerForEvent,
  getMyRegisteredEvents,
  getEventAnalytics,
} = require('../controllers/registrationController');
// Register for an event
router.post(
  '/register',
  authMiddleware,
  registerForEvent
);


// Get student's registered events
router.get(
  '/my-events/:studentId',
  authMiddleware,
  getMyRegisteredEvents
);


// Get event participation analytics
router.get(
  '/analytics/:eventId',
  authMiddleware,
  getEventAnalytics
);

module.exports = router;