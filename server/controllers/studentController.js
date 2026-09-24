const Student = require("../models/Student");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const EventRegistration = require("../models/EventRegistration");
const logAudit = require("../utils/auditLogger");
const Fee = require("../models/Fee");
const Result = require("../models/Result");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Enrollment = require("../models/Enrollment");
const Planner = require("../models/Planner");
// Create Student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, department, year } = req.body;

    if (!name || !email || !rollNumber || !department || !year) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const student = await Student.create({
      name,
      email,
      rollNumber,
      department,
      year,
      createdBy: req.user.id,
    });
    await logAudit({
  user: req.user.id,
  action: "CREATE",
  resourceType: "Student",
  resourceId: student._id,
  details: `Created student ${student.name} (${student.rollNumber})`,
});

    return res.status(201).json({
      message: "Student created successfully",
      student,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
  const {
  name,
  department,
  year,
  page = 1,
  limit = 5,
  sort = 'newest',
} = req.query;
const filter = {};

if (name) {
  const searchTerm = name.trim();

  const yearMatch = searchTerm.match(/^year\s+([1-4])$/i);

  if (yearMatch) {
    filter.year = Number(yearMatch[1]);
  } else {
    filter.$or = [
      {
        name: {
          $regex: searchTerm,
          $options: "i",
        },
      },
      {
        email: {
          $regex: searchTerm,
          $options: "i",
        },
      },
      {
        rollNumber: {
          $regex: searchTerm,
          $options: "i",
        },
      },
      {
        department: {
          $regex: searchTerm,
          $options: "i",
        },
      },
    ];
  }
}
if (department) {
  filter.department = department;
}

if (year) {
  filter.year = Number(year);
}
const pageNumber = Number(page);
const limitNumber = Number(limit);
const skip = (pageNumber - 1) * limitNumber;

let sortOption = {};

if (sort === "newest") {
  sortOption = { createdAt: -1 };
} else if (sort === "oldest") {
  sortOption = { createdAt: 1 };
} else if (sort === "az") {
  sortOption = { name: 1 };
} else if (sort === "za") {
  sortOption = { name: -1 };
}
  const students = await Student.find(filter)
  .populate("createdBy", "name email role")
  .sort(sortOption)
  .skip(skip)
  .limit(limitNumber);
  const totalStudents = await Student.countDocuments(filter);

return res.status(200).json({
  totalStudents,
  currentPage: pageNumber,
  totalPages: Math.ceil(totalStudents / limitNumber),
  students,
});


  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get Student By ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
   

    return res.status(200).json({
      student,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get Logged-In Student Profile
exports.getMyStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    return res.status(200).json({
      student,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, department, year } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        rollNumber,
        department,
        year,
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    await logAudit({
  user: req.user.id,
  action: "UPDATE",
  resourceType: "Student",
  resourceId: student._id,
  details: `Updated student ${student.name} (${student.rollNumber})`,
});

    return res.status(200).json({
      message: "Student updated successfully",
      student,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    const feeCount = await Fee.countDocuments({
  student: student._id,
});

if (feeCount > 0) {
  return res.status(409).json({
    message: "Cannot delete this student because fee records exist for them.",
  });
}
const resultCount = await Result.countDocuments({
  student: student._id,
});

if (resultCount > 0) {
  return res.status(409).json({
    message: "Cannot delete this student because result records exist for them.",
  });
}

const submissionCount = await AssignmentSubmission.countDocuments({
  student: student._id,
});

if (submissionCount > 0) {
  return res.status(409).json({
    message:
      "Cannot delete this student because assignment submissions exist for them.",
  });
}
const enrollmentCount = await Enrollment.countDocuments({
  student: student._id,
});

if (enrollmentCount > 0) {
  return res.status(409).json({
    message: "Cannot delete this student because enrollment records exist for them.",
  });
}

    // Remove related attendance records
    await Attendance.deleteMany({
      student: student._id,
    });

    // Remove related event registrations
    await EventRegistration.deleteMany({
      student: student._id,
    });
    // Remove personal planner entries
await Planner.deleteMany({
  student: student._id,
});

    
// Delete linked login account, if one exists
if (student.user) {
  await User.findByIdAndDelete(student.user);
}

// Delete student
await student.deleteOne();

await logAudit({
  user: req.user.id,
  action: "DELETE",
  resourceType: "Student",
  resourceId: student._id,
  details: `Deleted student ${student.name} (${student.rollNumber})`,
});

return res.status(200).json({
  message: "Student deleted successfully",
});
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

    