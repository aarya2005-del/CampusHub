const Student = require("../models/Student");

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
    const students = await Student.find().populate(
      "createdBy",
      "name email role"
    );

    return res.status(200).json({
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
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message: "Student deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};