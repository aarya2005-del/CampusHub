const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Card",
        "Bank Transfer",
        "Other",
      ],
      required: true,
    },
    referenceNumber: {
      type: String,
      trim: true,
      default: "",
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    feeType: {
  type: String,
  enum: [
    "Tuition",
    "Hostel",
    "Transportation",
    "Examination",
    "Library",
    "Laboratory",
    "Other",
  ],
  required: true,
},
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    payments: {
      type: [paymentSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

feeSchema.index(
  {
    student: 1,
    academicYear: 1,
    semester: 1,
    feeType: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Fee", feeSchema);