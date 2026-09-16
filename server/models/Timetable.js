const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
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

    facultyName: {
      type: String,
      required: true,
      trim: true,
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

timetableSchema.index(
  {
    course: 1,
    day: 1,
    startTime: 1,
    endTime: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Timetable",
  timetableSchema
);