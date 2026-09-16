const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getExamStudents,
  saveResult,
  setPublicationStatus,
  getMyResults,
} = require("../controllers/resultController");

// Student - view own published results
router.get(
  "/me",
  authMiddleware,
  getMyResults
);

// Admin - get enrolled students and their results for an exam
router.get(
  "/exam/:examId",
  authMiddleware,
  adminMiddleware,
  getExamStudents
);

// Admin - create or update a student's result
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  saveResult
);

// Admin - publish or unpublish all entered results for an exam
router.put(
  "/exam/:examId/publish",
  authMiddleware,
  adminMiddleware,
  setPublicationStatus
);

module.exports = router;