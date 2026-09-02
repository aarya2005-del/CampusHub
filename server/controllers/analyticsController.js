const Student = require('../models/Student');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');

exports.getStudentsByDepartment = async (req, res) => {
  try {
    const stats = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      stats,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getStudentsByYear = async (req, res) => {
  try {
    const stats = await Student.aggregate([
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.status(200).json({
      stats,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getEventsPerMonth = async (req, res) => {
  try {
    const stats = await Event.aggregate([
      {
        $match: {
          eventDate: {
            $gte: new Date('2026-01-01'),
            $lt: new Date('2027-01-01'),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$eventDate' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.status(200).json({
      stats,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Overall Attendance Analytics
// ==============================

exports.getOverallAttendance = async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      {
        $group: {
          _id: null,

          totalClasses: {
            $sum: 1,
          },

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
    ]);

    const attendance = stats[0] || {
      totalClasses: 0,
      presentClasses: 0,
      absentClasses: 0,
    };

    const attendancePercentage =
      attendance.totalClasses > 0
        ? Number(
            (
              (attendance.presentClasses /
                attendance.totalClasses) *
              100
            ).toFixed(2)
          )
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalClasses: attendance.totalClasses,
        presentClasses: attendance.presentClasses,
        absentClasses: attendance.absentClasses,
        attendancePercentage,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getAttendanceTrend = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const stats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [
                { $eq: ["$status", "present"] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const result = stats.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      attendance:
        item.total > 0
          ? Number(
              ((item.present / item.total) * 100).toFixed(2)
            )
          : 0,
    }));

    return res.status(200).json({
      success: true,
      stats: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};