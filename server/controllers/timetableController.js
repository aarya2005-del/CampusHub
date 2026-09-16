const Timetable = require("../models/Timetable");
const Course = require("../models/Course");
const Student = require("../models/Student");
const Enrollment = require("../models/Enrollment");

// ================= CREATE TIMETABLE ENTRY =================
exports.createTimetableEntry = async (req, res) => {
  try {
    const {
      courseId,
      day,
      startTime,
      endTime,
      room,
      facultyName,
    } = req.body;

    if (
      !courseId ||
      !day ||
      !startTime ||
      !endTime ||
      !room ||
      !facultyName
    ) {
      return res.status(400).json({
        message: "All timetable fields are required",
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

    const entry = await Timetable.create({
      course: courseId,
      day,
      startTime,
      endTime,
      room,
      facultyName,
      createdBy: req.user.id,
    });

    const populatedEntry = await Timetable.findById(entry._id)
      .populate(
        "course",
        "name code department year semester credits"
      )
      .populate("createdBy", "name email role");

    return res.status(201).json({
      message: "Timetable entry created successfully",
      entry: populatedEntry,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "This course already has a timetable entry at this time",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ALL TIMETABLE =================
exports.getAllTimetable = async (req, res) => {
  try {
    const entries = await Timetable.find()
      .populate(
        "course",
        "name code department year semester credits"
      )
      .sort({ startTime: 1 });

    return res.status(200).json({
      entries,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET MY TIMETABLE =================
exports.getMyTimetable = async (req, res) => {
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

    const entries = await Timetable.find({
      course: { $in: courseIds },
    })
      .populate(
        "course",
        "name code department year semester credits"
      )
      .sort({ startTime: 1 });

    return res.status(200).json({
      entries,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE TIMETABLE ENTRY =================
exports.deleteTimetableEntry = async (req, res) => {
  try {
    const entry = await Timetable.findById(
      req.params.id
    );

    if (!entry) {
      return res.status(404).json({
        message: "Timetable entry not found",
      });
    }

    await entry.deleteOne();

    return res.status(200).json({
      message: "Timetable entry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};