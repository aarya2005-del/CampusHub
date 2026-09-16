const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Pass", "Fail"],
      required: true,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    published: {
      type: Boolean,
      default: false,
    },

    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One result per student for each exam
resultSchema.index(
  {
    exam: 1,
    student: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Result", resultSchema);