const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    examType: {
      type: String,
      enum: [
        "Internal",
        "Mid Semester",
        "End Semester",
        "Practical",
        "Other",
      ],
      required: true,
    },

    examDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    room: {
      type: String,
      required: true,
      trim: true,
    },

    maxMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    instructions: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent an exact duplicate exam for the same course
examSchema.index(
  {
    course: 1,
    examType: 1,
    examDate: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);