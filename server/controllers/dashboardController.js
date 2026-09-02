const Student = require('../models/Student');
const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();

    const totalStudents = await Student.countDocuments();
    const totalNotices = await Notice.countDocuments();
    const totalEvents = await Event.countDocuments();

    const upcomingEvents = await Event.countDocuments({
      eventDate: { $gte: today },
    });

    // Get recent records from each collection
    const [students, events, notices, attendance] =
      await Promise.all([
        Student.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name createdAt'),

        Event.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('title createdAt'),

        Notice.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('title createdAt'),

        Attendance.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('status date createdAt'),
      ]);

    // Convert records into dashboard activity objects
    const recentActivity = [
      ...students.map((student) => ({
        id: `student-${student._id}`,
        type: 'student',
        message: `Student ${student.name} registered.`,
        createdAt: student.createdAt,
      })),

      ...events.map((event) => ({
        id: `event-${event._id}`,
        type: 'event',
        message: `New event ${event.title} created.`,
        createdAt: event.createdAt,
      })),

      ...notices.map((notice) => ({
        id: `notice-${notice._id}`,
        type: 'notice',
        message: `Notice ${notice.title} published.`,
        createdAt: notice.createdAt,
      })),

      ...attendance.map((record) => ({
        id: `attendance-${record._id}`,
        type: 'attendance',
        message: `Attendance marked as ${record.status}.`,
        createdAt: record.createdAt,
      })),
    ];

    // Sort all activity together and keep the latest 10
    recentActivity.sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    const latestActivity = recentActivity.slice(0, 10);

    return res.status(200).json({
      totalStudents,
      totalNotices,
      totalEvents,
      upcomingEvents,
      recentActivity: latestActivity,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};