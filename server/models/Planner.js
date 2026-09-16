const mongoose = require("mongoose");

const plannerSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    date: {
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

    category: {
      type: String,
      enum: [
        "study",
        "assignment",
        "exam",
        "meeting",
        "personal",
        "other",
      ],
      default: "study",
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

plannerSchema.index({
  student: 1,
  date: 1,
  startTime: 1,
});

module.exports = mongoose.model("Planner", plannerSchema);