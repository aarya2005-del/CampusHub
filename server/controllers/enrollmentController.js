const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");

// Enroll Student in Course - Admin
exports.enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        message: "Student and course are required",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        message: "Student is already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      enrolledBy: req.user.id,
    });

    const populatedEnrollment = await Enrollment.findById(
      enrollment._id
    )
      .populate("student", "name email rollNumber department year")
      .populate("course")
      .populate("enrolledBy", "name email role");

    return res.status(201).json({
      message: "Student enrolled successfully",
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get Course Enrollments - Admin
exports.getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      course: req.params.courseId,
    })
      .populate("student", "name email rollNumber department year")
      .populate("course", "name code department year semester credits");

    return res.status(200).json({
      enrollments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get Logged-In Student Courses
exports.getMyCourses = async (req, res) => {
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
    }).populate(
      "course",
      "name code department year semester credits"
    );

    return res.status(200).json({
      enrollments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Remove Enrollment - Admin
exports.removeEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(
      req.params.enrollmentId
    );

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    await enrollment.deleteOne();

    return res.status(200).json({
      message: "Enrollment removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};