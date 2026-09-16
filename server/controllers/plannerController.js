const Planner = require("../models/Planner");
const Student = require("../models/Student");

// Find the student profile linked to the logged-in user
const getLoggedInStudent = async (userId) => {
  return Student.findOne({ user: userId });
};

// ================= CREATE PLANNER ITEM =================
exports.createPlannerItem = async (req, res) => {
  try {
    const student = await getLoggedInStudent(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const {
      title,
      description,
      date,
      startTime,
      endTime,
      category,
    } = req.body;

    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({
        message:
          "Title, date, start time, and end time are required",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    const item = await Planner.create({
      student: student._id,
      title,
      description: description || "",
      date,
      startTime,
      endTime,
      category: category || "study",
    });

    return res.status(201).json({
      message: "Planner item created successfully",
      item,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET MY PLANNER =================
exports.getMyPlanner = async (req, res) => {
  try {
    const student = await getLoggedInStudent(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const items = await Planner.find({
      student: student._id,
    }).sort({
      date: 1,
      startTime: 1,
    });

    return res.status(200).json({
      items,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE PLANNER ITEM =================
exports.updatePlannerItem = async (req, res) => {
  try {
    const student = await getLoggedInStudent(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const item = await Planner.findOne({
      _id: req.params.id,
      student: student._id,
    });

    if (!item) {
      return res.status(404).json({
        message: "Planner item not found",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "date",
      "startTime",
      "endTime",
      "category",
      "completed",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    if (item.startTime >= item.endTime) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    await item.save();

    return res.status(200).json({
      message: "Planner item updated successfully",
      item,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE PLANNER ITEM =================
exports.deletePlannerItem = async (req, res) => {
  try {
    const student = await getLoggedInStudent(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const item = await Planner.findOneAndDelete({
      _id: req.params.id,
      student: student._id,
    });

    if (!item) {
      return res.status(404).json({
        message: "Planner item not found",
      });
    }

    return res.status(200).json({
      message: "Planner item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};