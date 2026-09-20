const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// Admin student report
exports.getStudentReport = async (req, res) => {
  try {
    const students = await Student.find()
      .select(
        "name email rollNumber department year createdAt"
      )
      .sort({
        department: 1,
        year: 1,
        rollNumber: 1,
      });

    const departmentSummary =
      await Student.aggregate([
        {
          $group: {
            _id: "$department",
            totalStudents: { $sum: 1 },
          },
        },
        {
          $sort: {
            totalStudents: -1,
          },
        },
      ]);

    const yearSummary = await Student.aggregate([
      {
        $group: {
          _id: "$year",
          totalStudents: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    return res.status(200).json({
      totalStudents: students.length,
      departmentSummary,
      yearSummary,
      students,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Admin attendance report
exports.getAttendanceReport = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate(
        "student",
        "name rollNumber department year"
      )
      .populate(
        "course",
        "name code department year semester"
      )
      .sort({ date: -1 });

    const attendance = records.map((record) => ({
      _id: record._id,
      studentName:
        record.student?.name || "Unknown",
      rollNumber:
        record.student?.rollNumber || "-",
      studentDepartment:
        record.student?.department || "-",
      courseName:
        record.course?.name || "Unknown",
      courseCode:
        record.course?.code || "-",
      semester:
        record.course?.semester || "-",
      date: record.date,
      status: record.status,
    }));

    const totalRecords = attendance.length;

    const presentCount = attendance.filter(
      (record) => record.status === "present"
    ).length;

    const absentCount = attendance.filter(
      (record) => record.status === "absent"
    ).length;

    const attendancePercentage =
      totalRecords > 0
        ? Number(
            (
              (presentCount / totalRecords) *
              100
            ).toFixed(2)
          )
        : 0;

    const courseSummary =
      await Attendance.aggregate([
        {
          $group: {
            _id: "$course",
            totalClasses: { $sum: 1 },
            present: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "present"] },
                  1,
                  0,
                ],
              },
            },
            absent: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "absent"] },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: {
            path: "$course",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            courseName: "$course.name",
            courseCode: "$course.code",
            totalClasses: 1,
            present: 1,
            absent: 1,
            attendancePercentage: {
              $cond: [
                { $gt: ["$totalClasses", 0] },
                {
                  $round: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            "$present",
                            "$totalClasses",
                          ],
                        },
                        100,
                      ],
                    },
                    2,
                  ],
                },
                0,
              ],
            },
          },
        },
        {
          $sort: {
            courseCode: 1,
          },
        },
      ]);

    return res.status(200).json({
      totalRecords,
      presentCount,
      absentCount,
      attendancePercentage,
      courseSummary,
      attendance,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};