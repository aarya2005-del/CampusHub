const Fee = require("../models/Fee");
const Student = require("../models/Student");

// Helper: calculate fee summary
const getFeeSummary = (fee) => {
  const paidAmount = fee.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const balance = Math.max(
    fee.totalAmount - paidAmount,
    0
  );

  let status = "Unpaid";

  if (paidAmount >= fee.totalAmount) {
    status = "Paid";
  } else if (paidAmount > 0) {
    status = "Partially Paid";
  }

  return {
    paidAmount,
    balance,
    status,
  };
};

// ================= CREATE FEE =================
exports.createFee = async (req, res) => {
  try {
    const {
  studentId,
  academicYear,
  semester,
  feeType,
  totalAmount,
  dueDate,
} = req.body;
    if (
  !studentId ||
  !academicYear ||
  !semester ||
  !feeType ||
  totalAmount === undefined ||
  !dueDate
) {
      return res.status(400).json({
        message: "All fee fields are required",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const amount = Number(totalAmount);

    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({
        message: "Total amount must be a valid number",
      });
    }

    const fee = await Fee.create({
  student: studentId,
  academicYear,
  semester,
  feeType,
  totalAmount: amount,
  dueDate,
  createdBy: req.user.id,
});

    await fee.populate(
      "student",
      "name email rollNumber department year"
    );

    return res.status(201).json({
      message: "Fee record created successfully",
      fee: {
        ...fee.toObject(),
        ...getFeeSummary(fee),
      },
    });
  } catch (error) {
    if (error.code === 11000) {
  return res.status(400).json({
    message:
      "A fee record already exists for this student, academic year, semester, and fee type",
  });
}

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ALL FEES =================
exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate(
        "student",
        "name email rollNumber department year"
      )
      .populate(
        "payments.recordedBy",
        "name email"
      )
      .sort({ createdAt: -1 });

    const feeRecords = fees.map((fee) => ({
      ...fee.toObject(),
      ...getFeeSummary(fee),
    }));

    return res.status(200).json({
      fees: feeRecords,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= RECORD PAYMENT =================
exports.recordPayment = async (req, res) => {
  try {
    const {
      amount,
      paymentMethod,
      referenceNumber,
      paymentDate,
    } = req.body;

    if (
      amount === undefined ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message:
          "Payment amount and payment method are required",
      });
    }

    const paymentAmount = Number(amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return res.status(400).json({
        message:
          "Payment amount must be greater than zero",
      });
    }

    const fee = await Fee.findById(req.params.feeId);

    if (!fee) {
      return res.status(404).json({
        message: "Fee record not found",
      });
    }

    const currentSummary = getFeeSummary(fee);

    if (currentSummary.balance <= 0) {
      return res.status(400).json({
        message: "This fee is already fully paid",
      });
    }

    if (paymentAmount > currentSummary.balance) {
      return res.status(400).json({
        message: `Payment cannot exceed outstanding balance of ${currentSummary.balance}`,
      });
    }

    fee.payments.push({
      amount: paymentAmount,
      paymentMethod,
      referenceNumber: referenceNumber || "",
      paymentDate: paymentDate || new Date(),
      recordedBy: req.user.id,
    });

    await fee.save();

    await fee.populate(
      "student",
      "name email rollNumber department year"
    );

    await fee.populate(
      "payments.recordedBy",
      "name email"
    );

    return res.status(200).json({
      message: "Payment recorded successfully",
      fee: {
        ...fee.toObject(),
        ...getFeeSummary(fee),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET MY FEES =================
exports.getMyFees = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const fees = await Fee.find({
      student: student._id,
    })
      .populate(
        "payments.recordedBy",
        "name"
      )
      .sort({ createdAt: -1 });

    const feeRecords = fees.map((fee) => ({
      ...fee.toObject(),
      ...getFeeSummary(fee),
    }));

    return res.status(200).json({
      fees: feeRecords,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};