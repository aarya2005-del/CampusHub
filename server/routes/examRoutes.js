const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createExam,
  getAllExams,
  getMyExams,
  deleteExam,
} = require("../controllers/examController");

// Student - get exams for enrolled courses
router.get(
  "/me",
  authMiddleware,
  getMyExams
);

// Admin - get complete exam schedule
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllExams
);

// Admin - schedule an exam
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createExam
);

// Admin - delete an exam
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteExam
);

module.exports = router;