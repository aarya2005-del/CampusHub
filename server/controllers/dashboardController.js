const Student = require('../models/Student');
const Notice = require('../models/Notice');
const Event = require('../models/Event');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();

    const totalStudents = await Student.countDocuments();
    const totalNotices = await Notice.countDocuments();
    const totalEvents = await Event.countDocuments();

    const upcomingEvents = await Event.countDocuments({
      eventDate: { $gte: today },
    });

    return res.status(200).json({
      totalStudents,
      totalNotices,
      totalEvents,
      upcomingEvents,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};