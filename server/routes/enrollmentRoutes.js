const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  enrollStudent,
  getCourseEnrollments,
  getMyCourses,
  removeEnrollment,
} = require("../controllers/enrollmentController");

// Logged-in student's own courses
// IMPORTANT: keep /my-courses before /course/:courseId
router.get(
  "/my-courses",
  authMiddleware,
  getMyCourses
);

// Enroll student - Admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  enrollStudent
);

// Get students enrolled in a course - Admin only
router.get(
  "/course/:courseId",
  authMiddleware,
  adminMiddleware,
  getCourseEnrollments
);

// Remove enrollment - Admin only
router.delete(
  "/:enrollmentId",
  authMiddleware,
  adminMiddleware,
  removeEnrollment
);

module.exports = router;