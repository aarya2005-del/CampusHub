const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createTimetableEntry,
  getAllTimetable,
  getMyTimetable,
  deleteTimetableEntry,
} = require("../controllers/timetableController");

// Student's own timetable
router.get(
  "/me",
  authMiddleware,
  getMyTimetable
);

// Admin - get complete timetable
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllTimetable
);

// Admin - create timetable entry
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createTimetableEntry
);

// Admin - delete timetable entry
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteTimetableEntry
);

module.exports = router;