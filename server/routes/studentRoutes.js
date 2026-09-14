const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createStudent,
  getAllStudents,
  getStudentById,
  getMyStudentProfile,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// Create Student (Admin only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createStudent
);

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllStudents
);

// Get Logged-In Student Profile
router.get(
  "/me",
  authMiddleware,
  getMyStudentProfile
);

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getStudentById
);

// Update Student (Admin only)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateStudent
);

// Delete Student (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteStudent
);

module.exports = router;