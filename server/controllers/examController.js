const Exam = require("../models/Exam");
const Course = require("../models/Course");
const Student = require("../models/Student");
const Enrollment = require("../models/Enrollment");

// ================= CREATE EXAM =================
exports.createExam = async (req, res) => {
  try {
    const {
      courseId,
      examType,
      examDate,
      startTime,
      endTime,
      room,
      maxMarks,
      instructions,
    } = req.body;

    if (
      !courseId ||
      !examType ||
      !examDate ||
      !startTime ||
      !endTime ||
      !room ||
      !maxMarks
    ) {
      return res.status(400).json({
        message: "All required exam fields must be provided",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const exam = await Exam.create({
      course: courseId,
      examType,
      examDate,
      startTime,
      endTime,
      room,
      maxMarks,
      instructions: instructions || "",
      createdBy: req.user.id,
    });

    const populatedExam = await Exam.findById(exam._id)
      .populate(
        "course",
        "name code department year semester credits"
      )
      .populate("createdBy", "name email role");

    return res.status(201).json({
      message: "Exam scheduled successfully",
      exam: populatedExam,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "An exam of this type is already scheduled for this course on this date",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ALL EXAMS =================
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate(
        "course",
        "name code department year semester credits"
      )
      .sort({
        examDate: 1,
        startTime: 1,
      });

    return res.status(200).json({
      exams,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET MY EXAMS =================
exports.getMyExams = async (req, res) => {
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

    const exams = await Exam.find({
      course: {
        $in: courseIds,
      },
    })
      .populate(
        "course",
        "name code department year semester credits"
      )
      .sort({
        examDate: 1,
        startTime: 1,
      });

    return res.status(200).json({
      exams,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE EXAM =================
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    await exam.deleteOne();

    return res.status(200).json({
      message: "Exam deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};