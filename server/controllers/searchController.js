const Student = require("../models/Student");
const Event = require("../models/Event");
const Notice = require("../models/Notice");

exports.globalSearch = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query || query.length < 2) {
      return res.status(200).json({
        students: [],
        events: [],
        notices: [],
      });
    }

    const regex = new RegExp(
      query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    const eventPromise = Event.find({
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
      ],
    })
      .select("title description location eventDate")
      .sort({ eventDate: -1 })
      .limit(5);

    let noticeFilter = {
      $or: [
        { title: regex },
        { description: regex },
      ],
    };

    if (req.user.role !== "admin") {
      const audienceMap = {
        student: "Students",
        faculty: "Faculty",
        staff: "Staff",
      };

      const audience = audienceMap[req.user.role];

      noticeFilter = {
        $and: [
          noticeFilter,
          {
            $or: [
              { audience: "All" },
              { audience },
              { audience: { $exists: false } },
            ],
          },
        ],
      };
    }

    const noticePromise = Notice.find(noticeFilter)
      .select("title description audience createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    let studentPromise = Promise.resolve([]);

    if (req.user.role === "admin") {
      studentPromise = Student.find({
        $or: [
          { name: regex },
          { email: regex },
          { rollNumber: regex },
          { department: regex },
        ],
      })
        .select(
          "name email rollNumber department semester"
        )
        .limit(5);
    }

    const [students, events, notices] =
      await Promise.all([
        studentPromise,
        eventPromise,
        noticePromise,
      ]);

    return res.status(200).json({
      students,
      events,
      notices,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};