const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// ================= MARK ATTENDANCE =================
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    // Validate fields
    if (!studentId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all fields',
      });
    }

    // Validate status
    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be present or absent',
      });
    }

    // Check student exists
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Create or update attendance
const attendanceDate = new Date(date);
attendanceDate.setHours(0, 0, 0, 0);

const attendance = await Attendance.findOneAndUpdate(
  {
    student: studentId,
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
);

    return res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: { attendance },
    });

  } catch (error) {
    // Handle duplicate attendance
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Attendance already marked for this student on this date',
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
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate(
        "student",
        "name rollNumber department year"
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