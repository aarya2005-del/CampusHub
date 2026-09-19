const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);
const facultyAdminMiddleware = require(
  "../middleware/facultyAdminMiddleware"
);
const assignmentUpload = require(
  "../middleware/assignmentUploadMiddleware"
);
const {
  submitAssignment,
  getMySubmissions,
  getAssignmentSubmissions,
  gradeSubmission,
} = require(
  "../controllers/assignmentSubmissionController"
);
router.get(
  "/me",
  authMiddleware,
  getMySubmissions
);
router.get(
  "/assignment/:assignmentId",
  authMiddleware,
  facultyAdminMiddleware,
  getAssignmentSubmissions
);
router.patch(
  "/:submissionId/grade",
  authMiddleware,
  facultyAdminMiddleware,
  gradeSubmission
);
router.post(
  "/:assignmentId",
  authMiddleware,
  assignmentUpload.single("file"),
  submitAssignment
);;

module.exports = router;