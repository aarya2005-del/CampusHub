const Student = require('../models/Student');
const Notice = require('../models/Notice');
const Event = require('../models/Event');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();

    const [
      totalStudents,
      totalNotices,
      totalEvents,
      upcomingEvents,
      recentStudents,
      recentEvents,
      recentNotices,
    ] = await Promise.all([
      Student.countDocuments(),
      Notice.countDocuments(),
      Event.countDocuments(),

      Event.countDocuments({
        eventDate: { $gte: today },
      }),

      Student.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('name createdAt'),

      Event.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('title createdAt'),

      Notice.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('title createdAt'),
    ]);

    const recentActivity = [
      ...recentStudents.map((student) => ({
        id: student._id,
        type: 'student',
        message: `Student added: ${student.name}`,
        createdAt: student.createdAt,
      })),

      ...recentEvents.map((event) => ({
        id: event._id,
        type: 'event',
        message: `Event created: ${event.title}`,
        createdAt: event.createdAt,
      })),

      ...recentNotices.map((notice) => ({
        id: notice._id,
        type: 'notice',
        message: `Notice published: ${notice.title}`,
        createdAt: notice.createdAt,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 5);

    return res.status(200).json({
      totalStudents,
      totalNotices,
      totalEvents,
      upcomingEvents,
      recentActivity,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};