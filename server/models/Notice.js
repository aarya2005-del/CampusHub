const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    audience: {
  type: String,
  enum: ["All", "Students", "Faculty", "Staff"],
  default: "All",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notice", noticeSchema);