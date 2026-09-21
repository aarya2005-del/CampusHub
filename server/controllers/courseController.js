const Course = require("../models/Course");
const logAudit = require("../utils/auditLogger");

// Create Course
exports.createCourse = async (req, res) => {
  try {
    const {
      name,
      code,
      department,
      year,
      semester,
      credits,
    } = req.body;

    if (
      !name ||
      !code ||
      !department ||
      !year ||
      !semester ||
      !credits
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const existingCourse = await Course.findOne({
      code: code.toUpperCase(),
    });

    if (existingCourse) {
      return res.status(409).json({
        message: "Course code already exists",
      });
    }

    const course = await Course.create({
      name,
      code,
      department,
      year: Number(year),
      semester: Number(semester),
      credits: Number(credits),
      createdBy: req.user.id,
    });
    await logAudit({
  user: req.user.id,
  action: "CREATE",
  resourceType: "Course",
  resourceId: course._id,
  details: `Created course ${course.code} - ${course.name}`,
});

    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get Course By ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      course,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update Course
exports.updateCourse = async (req, res) => {
  try {
    const {
      name,
      code,
      department,
      year,
      semester,
      credits,
    } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        name,
        code,
        department,
        year,
        semester,
        credits,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
await logAudit({
  user: req.user.id,
  action: "UPDATE",
  resourceType: "Course",
  resourceId: course._id,
  details: `Updated course ${course.code} - ${course.name}`,
});
    return res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Course code already exists",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    await course.deleteOne();

await logAudit({
  user: req.user.id,
  action: "DELETE",
  resourceType: "Course",
  resourceId: course._id,
  details: `Deleted course ${course.code} - ${course.name}`,
});

return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};