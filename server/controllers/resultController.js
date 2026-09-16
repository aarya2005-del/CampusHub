const Result = require("../models/Result");
const Exam = require("../models/Exam");
const Student = require("../models/Student");
const Enrollment = require("../models/Enrollment");

// ================= GET STUDENTS FOR EXAM =================
exports.getExamStudents = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId)
      .populate("course", "name code");

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    const enrollments = await Enrollment.find({
      course: exam.course._id,
    }).populate(
      "student",
      "name email rollNumber department year"
    );

    const existingResults = await Result.find({
      exam: exam._id,
    });

    const resultMap = new Map(
      existingResults.map((result) => [
        result.student.toString(),
        result,
      ])
    );

    const students = enrollments
      .filter((enrollment) => enrollment.student)
      .map((enrollment) => {
        const result = resultMap.get(
          enrollment.student._id.toString()
        );

        return {
          student: enrollment.student,
          result: result || null,
        };
      });

    return res.status(200).json({
      exam,
      students,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= SAVE / UPDATE RESULT =================
exports.saveResult = async (req, res) => {
  try {
    const {
      examId,
      studentId,
      marksObtained,
      remarks,
    } = req.body;

    if (
      !examId ||
      !studentId ||
      marksObtained === undefined ||
      marksObtained === null ||
      marksObtained === ""
    ) {
      return res.status(400).json({
        message:
          "Exam, student, and marks obtained are required",
      });
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: exam.course,
    });

    if (!enrollment) {
      return res.status(400).json({
        message:
          "Student is not enrolled in this exam's course",
      });
    }

    const marks = Number(marksObtained);

    if (!Number.isFinite(marks) || marks < 0) {
      return res.status(400).json({
        message: "Marks must be a valid non-negative number",
      });
    }

    if (marks > exam.maxMarks) {
      return res.status(400).json({
        message: `Marks cannot exceed ${exam.maxMarks}`,
      });
    }

    // 40% is currently used as the passing threshold.
    const passMarks = exam.maxMarks * 0.4;
    const status = marks >= passMarks ? "Pass" : "Fail";

    const result = await Result.findOneAndUpdate(
      {
        exam: examId,
        student: studentId,
      },
      {
        marksObtained: marks,
        status,
        remarks: remarks || "",
        enteredBy: req.user.id,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    )
      .populate(
        "student",
        "name email rollNumber department year"
      )
      .populate({
        path: "exam",
        populate: {
          path: "course",
          select: "name code",
        },
      });

    return res.status(200).json({
      message: "Result saved successfully",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= PUBLISH / UNPUBLISH EXAM RESULTS =================
exports.setPublicationStatus = async (req, res) => {
  try {
    const { published } = req.body;

    if (typeof published !== "boolean") {
      return res.status(400).json({
        message: "Published must be true or false",
      });
    }

    const exam = await Exam.findById(req.params.examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    const updateResult = await Result.updateMany(
      {
        exam: exam._id,
      },
      {
        $set: {
          published,
        },
      }
    );

    return res.status(200).json({
      message: published
        ? "Results published successfully"
        : "Results unpublished successfully",
      updatedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET MY PUBLISHED RESULTS =================
exports.getMyResults = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const results = await Result.find({
      student: student._id,
      published: true,
    })
      .populate({
        path: "exam",
        populate: {
          path: "course",
          select: "name code department semester credits",
        },
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      results,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};