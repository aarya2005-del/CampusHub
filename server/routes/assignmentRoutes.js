const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const facultyAdminMiddleware = require(
  "../middleware/facultyAdminMiddleware"
);

const {
  createAssignment,
  getAllAssignments,
  getMyAssignments,
} = require("../controllers/assignmentController");

router.get(
  "/me",
  authMiddleware,
  getMyAssignments
);
router.get(
  "/",
  authMiddleware,
  facultyAdminMiddleware,
  getAllAssignments
);

router.post(
  "/",
  authMiddleware,
  facultyAdminMiddleware,
  createAssignment
);

module.exports = router;