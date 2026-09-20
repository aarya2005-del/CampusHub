const Student = require("../models/Student");

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