const Student = require('../models/Student');
const Event = require('../models/Event');

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