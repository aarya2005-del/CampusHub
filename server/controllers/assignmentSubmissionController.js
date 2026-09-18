const Assignment = require("../models/Assignment");
const AssignmentSubmission = require(
  "../models/AssignmentSubmission"
);
const Student = require("../models/Student");
const Enrollment = require("../models/Enrollment");

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { message } = req.body;

    // 1. Find the logged-in student's profile
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    // 2. Find the assignment
    const assignment = await Assignment.findById(
      assignmentId
    );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    // 3. Students can only submit published assignments
    if (assignment.status !== "Published") {
      return res.status(403).json({
        message:
          "This assignment is not available for submission",
      });
    }

    // 4. Check that the student is enrolled
    // in the assignment's subject
    const enrollment = await Enrollment.findOne({
      student: student._id,
      course: assignment.course,
    });

    if (!enrollment) {
      return res.status(403).json({
        message:
          "You are not enrolled in this subject",
      });
    }

    // 5. Reject submissions after the deadline
    if (new Date() > new Date(assignment.dueDate)) {
      return res.status(400).json({
        message:
          "The submission deadline has passed",
      });
    }

    // 6. Prevent duplicate submissions for now
    const existingSubmission =
      await AssignmentSubmission.findOne({
        assignment: assignment._id,
        student: student._id,
      });

    if (existingSubmission) {
      return res.status(409).json({
        message:
          "You have already submitted this assignment",
      });
    }

    // 7. Require either a message or uploaded file
    const fileUrl = req.file?.path || "";
    const filePublicId = req.file?.filename || "";

    if (!message?.trim() && !fileUrl) {
      return res.status(400).json({
        message:
          "Please enter a submission message or attach a file",
      });
    }

    // 8. Create submission
    const submission =
      await AssignmentSubmission.create({
        assignment: assignment._id,
        student: student._id,
        message: message?.trim() || "",
        fileUrl,
        filePublicId,
        submittedAt: new Date(),
      });

    await submission.populate([
      {
        path: "assignment",
        populate: {
          path: "course",
          select: "name code",
        },
      },
      {
        path: "student",
        select:
          "name rollNumber department year semester",
      },
    ]);

    return res.status(201).json({
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "You have already submitted this assignment",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const submissions =
      await AssignmentSubmission.find({
        student: student._id,
      })
        .populate({
          path: "assignment",
          select:
            "title description dueDate maxMarks course",
          populate: {
            path: "course",
            select: "name code",
          },
        })
        .populate(
          "gradedBy",
          "name email role"
        )
        .sort({ submittedAt: -1 });

    return res.status(200).json({
      submissions,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(
      assignmentId
    );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    const submissions =
      await AssignmentSubmission.find({
        assignment: assignmentId,
      })
        .populate(
          "student",
          "name rollNumber department year semester"
        )
        .populate(
          "gradedBy",
          "name email role"
        )
        .sort({ submittedAt: -1 });

    return res.status(200).json({
      assignment,
      submissions,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marksObtained, feedback } = req.body;

    const submission =
      await AssignmentSubmission.findById(
        submissionId
      ).populate("assignment");

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    const marks = Number(marksObtained);

    if (
      marksObtained === undefined ||
      marksObtained === "" ||
      Number.isNaN(marks) ||
      marks < 0
    ) {
      return res.status(400).json({
        message: "Please enter valid marks",
      });
    }

    if (marks > submission.assignment.maxMarks) {
      return res.status(400).json({
        message: `Marks cannot exceed ${submission.assignment.maxMarks}`,
      });
    }

    submission.marksObtained = marks;
    submission.feedback = feedback?.trim() || "";
    submission.gradedBy = req.user.id;
    submission.gradedAt = new Date();

    await submission.save();

    await submission.populate([
      {
        path: "student",
        select:
          "name rollNumber department year semester",
      },
      {
        path: "gradedBy",
        select: "name email role",
      },
    ]);

    return res.status(200).json({
      message: "Submission graded successfully",
      submission,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};