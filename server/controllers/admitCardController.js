const Student = require("../models/Student");
const Enrollment = require("../models/Enrollment");
const Exam = require("../models/Exam");

// ================= GET MY ADMIT CARD =================
exports.getMyAdmitCard = async (req, res) => {
  try {
    // Find student profile linked to logged-in user
    const student = await Student.findOne({
      user: req.user.id,
    }).select(
      "name email rollNumber department year"
    );

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    // Find courses the student is enrolled in
    const enrollments = await Enrollment.find({
      student: student._id,
    }).select("course");

    const courseIds = enrollments.map(
      (enrollment) => enrollment.course
    );

    // Find scheduled exams only for enrolled courses
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
      admitCard: {
        student,
        exams,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};