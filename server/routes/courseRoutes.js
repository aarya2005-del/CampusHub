const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

// Create Course - Admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCourse
);

// Get All Courses
router.get(
  "/",
  authMiddleware,
  getAllCourses
);

// Get Course By ID
router.get(
  "/:id",
  authMiddleware,
  getCourseById
);

// Update Course - Admin only
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCourse
);

// Delete Course - Admin only
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCourse
);

module.exports = router;