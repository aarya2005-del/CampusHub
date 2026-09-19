const Notice = require("../models/Notice");

// Create Notice
exports.createNotice = async (req, res) => {
  try {
    const {
  title,
  description,
  audience,
} = req.body;

    // Validate input
    if (!title || !description) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Save notice
    const notice = await Notice.create({
  title,
  description,
  audience,
  createdBy: req.user.id,
});
    return res.status(201).json({
      message: "Notice created successfully",
      notice,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Notices
// Get Notices Based on User Role
exports.getAllNotices = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "student") {
      filter = {
  $or: [
    { audience: "All" },
    { audience: "Students" },
    { audience: { $exists: false } },
  ],
};
    } else if (req.user.role === "faculty") {
      filter = {
  $or: [
    { audience: "All" },
    { audience: "Faculty" },
    { audience: { $exists: false } },
  ],
};
    } else if (req.user.role === "staff") {
      filter = {
  $or: [
    { audience: "All" },
    { audience: "Staff" },
    { audience: { $exists: false } },
  ],
};
    }

    const notices = await Notice.find(filter)
      .populate(
        "createdBy",
        "name email role"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      notices,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Get Single Notice
// Get Single Notice
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(
      req.params.id
    ).populate(
      "createdBy",
      "name email role"
    );

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    if (req.user.role !== "admin") {
      const allowedAudience = {
        student: "Students",
        faculty: "Faculty",
        staff: "Staff",
      };

      const audience = notice.audience || "All";

      if (
        audience !== "All" &&
        audience !== allowedAudience[req.user.role]
      ) {
        return res.status(403).json({
          message:
            "You do not have access to this notice",
        });
      }
    }

    return res.status(200).json({
      notice,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Update Notice
exports.updateNotice = async (req, res) => {
  try {
    const {
  title,
  description,
  audience = "All",
} = req.body;

    const notice = await Notice.findByIdAndUpdate(
  req.params.id,
  { title, description, audience },
      {
  new: true,
  runValidators: true,
}
    );

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    return res.status(200).json({
      message: "Notice updated successfully",
      notice,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Notice
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    return res.status(200).json({
      message: "Notice deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};