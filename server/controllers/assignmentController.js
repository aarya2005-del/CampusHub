const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const Student = require("../models/Student");
const Enrollment = require("../models/Enrollment");

exports.createAssignment = async (req, res) => {
  try {
    const {
      courseId,
      title,
      description,
      dueDate,
      maxMarks,
      status,
    } = req.body;

    if (
      !courseId ||
      !title ||
      !description ||
      !dueDate ||
      maxMarks === undefined
    ) {
      return res.status(400).json({
        message: "All assignment fields are required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const marks = Number(maxMarks);

    if (!Number.isFinite(marks) || marks < 1) {
      return res.status(400).json({
        message: "Maximum marks must be at least 1",
      });
    }

    const assignment = await Assignment.create({
      course: courseId,
      title,
      description,
      dueDate,
      maxMarks: marks,
      status: status || "Published",
      createdBy: req.user.id,
    });

    await assignment.populate(
      "course",
      "name code department year semester"
    );

    await assignment.populate(
      "createdBy",
      "name email role"
    );

    return res.status(201).json({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate(
        "course",
        "name code department year semester"
      )
      .populate(
        "createdBy",
        "name email role"
      )
      .sort({ dueDate: 1 });

    return res.status(200).json({
      assignments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.getMyAssignments = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const enrollments = await Enrollment.find({
      student: student._id,
    }).select("course");

    const courseIds = enrollments.map(
      (enrollment) => enrollment.course
    );

    const assignments = await Assignment.find({
      course: { $in: courseIds },
      status: "Published",
    })
      .populate(
        "course",
        "name code department year semester"
      )
      .populate(
        "createdBy",
        "name email role"
      )
      .sort({ dueDate: 1 });

    return res.status(200).json({
      assignments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};