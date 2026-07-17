const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createStudent,
  getAllStudents,
  getStudentById,
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

// Get All Students
router.get(
  "/",
  authMiddleware,
  getAllStudents
);

// Get Student By ID
router.get(
  "/:id",
  authMiddleware,
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