const Notice = require("../models/Notice");

// Create Notice
exports.createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;

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
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate(
      "createdBy",
      "name email role"
    );

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
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
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
    const { title, description } = req.body;

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
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