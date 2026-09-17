const LostFound = require("../models/LostFound");
const cloudinary = require("../config/cloudinary");

exports.createReport = async (req, res) => {
  try {
    const {
      type,
      itemName,
      category,
      description,
      location,
      itemDate,
      contactInfo,
    } = req.body;

    if (
      !type ||
      !itemName ||
      !category ||
      !description ||
      !location ||
      !itemDate ||
      !contactInfo
    ) {
      return res.status(400).json({
        message: "All lost and found fields are required",
      });
    }

    const report = await LostFound.create({
  type,
  itemName,
  category,
  description,
  location,
  itemDate,
  contactInfo,
  imageUrl: req.file?.path || "",
  imagePublicId: req.file?.filename || "",
  reportedBy: req.user.id,
});

    await report.populate(
      "reportedBy",
      "name email role"
    );

    return res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await LostFound.find()
      .populate(
        "reportedBy",
        "name email role"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      reports,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.resolveReport = async (req, res) => {
  try {
    const report = await LostFound.findById(
      req.params.reportId
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    const isOwner =
      report.reportedBy.toString() === req.user.id;

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message:
          "You are not allowed to update this report",
      });
    }

    report.status = "Resolved";
    await report.save();

    await report.populate(
      "reportedBy",
      "name email role"
    );

    return res.status(200).json({
      message: "Report marked as resolved",
      report,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can delete reports",
      });
    }

    const report = await LostFound.findById(
      req.params.reportId
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }
if (report.imagePublicId) {
  await cloudinary.uploader.destroy(
    report.imagePublicId
  );
}
    await report.deleteOne();

    return res.status(200).json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};