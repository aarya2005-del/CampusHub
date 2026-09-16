const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// ================= MARK SUBJECT-WISE ATTENDANCE =================
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, courseId, date, status } = req.body;

    if (!studentId || !courseId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Student, course, date and status are required',
      });
    }

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be present or absent',
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Student is not enrolled in this course',
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      {
        student: studentId,
        course: courseId,
        date: attendanceDate,
      },
      {
        status,
        markedBy: req.user.id,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    )
      .populate('student', 'name rollNumber department year')
      .populate('course', 'name code department year semester credits');

    return res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: { attendance },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Attendance already exists for this student, course and date',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET STUDENT ATTENDANCE =================
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({
      student: studentId,
    })
      .populate('student', 'name rollNumber department year')
      .populate('markedBy', 'name email role')
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: 'Attendance fetched successfully',
      data: { attendance },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= ATTENDANCE ANALYTICS =================
exports.getAttendanceAnalytics = async (req, res) => {
  try {
    const { studentId } = req.params;

    const analytics = await Attendance.aggregate([
      {
        $match: {
          student: require('mongoose').Types.ObjectId.createFromHexString(studentId),
        },
      },
      {
        $group: {
          _id: '$student',
          totalClasses: { $sum: 1 },
          presentClasses: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'present'] },
                1,
                0,
              ],
            },
          },
          absentClasses: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'absent'] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $addFields: {
          attendancePercentage: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      '$presentClasses',
                      '$totalClasses',
                    ],
                  },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
    ]);

    // Get student details
    const student = await Student.findById(studentId)
      .select('name rollNumber department year');

    return res.status(200).json({
      success: true,
      message: 'Attendance analytics fetched successfully',
      data: {
        student,
        analytics: analytics[0] || {
          totalClasses: 0,
          presentClasses: 0,
          absentClasses: 0,
          attendancePercentage: 0,
        },
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= GET ATTENDANCE BY DATE =================
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date, courseId } = req.query;

    if (!date || !courseId) {
  return res.status(400).json({
    success: false,
    message: "Date and course are required",
  });
}

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
  course: courseId,
  date: {
    $gte: startDate,
    $lte: endDate,
  },
})
      .populate(
        "student",
        "name rollNumber department year"
      )
      .populate(
  "course",
  "name code department year semester credits"
)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        attendance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= GET MY SUBJECT-WISE ATTENDANCE =================
exports.getMyAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    const records = await Attendance.find({
      student: student._id,
    })
      .populate(
        'course',
        'name code department year semester credits'
      )
      .sort({ date: -1 });

    const courseMap = {};

    records.forEach((record) => {
      if (!record.course) return;

      const courseId = record.course._id.toString();

      if (!courseMap[courseId]) {
        courseMap[courseId] = {
          course: record.course,
          totalClasses: 0,
          presentClasses: 0,
          absentClasses: 0,
        };
      }

      courseMap[courseId].totalClasses += 1;

      if (record.status === 'present') {
        courseMap[courseId].presentClasses += 1;
      }

      if (record.status === 'absent') {
        courseMap[courseId].absentClasses += 1;
      }
    });

    const subjects = Object.values(courseMap).map(
      (subject) => ({
        ...subject,
        attendancePercentage:
          subject.totalClasses > 0
            ? Number(
                (
                  (subject.presentClasses /
                    subject.totalClasses) *
                  100
                ).toFixed(2)
              )
            : 0,
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        student,
        subjects,
        records,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};