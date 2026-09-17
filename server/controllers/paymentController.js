const crypto = require("crypto");
const Razorpay = require("razorpay");

const Fee = require("../models/Fee");
const Student = require("../models/Student");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= CREATE PAYMENT ORDER =================
exports.createPaymentOrder = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const fee = await Fee.findOne({
      _id: req.params.feeId,
      student: student._id,
    });

    if (!fee) {
      return res.status(404).json({
        message: "Fee record not found",
      });
    }

    const paidAmount = fee.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const balance = fee.totalAmount - paidAmount;

    if (balance <= 0) {
      return res.status(400).json({
        message: "This fee is already fully paid",
      });
    }

    // Razorpay expects INR amounts in paise.
    const amountInPaise = Math.round(balance * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `fee_${fee._id.toString().slice(-12)}`,
      notes: {
        feeId: fee._id.toString(),
        studentId: student._id.toString(),
      },
    });

    return res.status(200).json({
      message: "Payment order created successfully",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
      fee: {
        id: fee._id,
        balance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.error?.description ||
        error.message ||
        "Unable to create payment order",
    });
  }
};

// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      feeId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !feeId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification data is incomplete",
      });
    }

    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const fee = await Fee.findOne({
      _id: feeId,
      student: student._id,
    });

    if (!fee) {
      return res.status(404).json({
        message: "Fee record not found",
      });
    }

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    // Fetch the verified order from Razorpay instead of
    // trusting an amount supplied by the frontend.
    const order = await razorpay.orders.fetch(
      razorpay_order_id
    );
    const payment = await razorpay.payments.fetch(
  razorpay_payment_id
);

if (
  payment.order_id !== razorpay_order_id ||
  !["authorized", "captured"].includes(payment.status)
) {
  return res.status(400).json({
    message: "Razorpay payment is not valid or completed",
  });
}

if (Number(payment.amount) !== Number(order.amount)) {
  return res.status(400).json({
    message: "Payment amount does not match the order",
  });
}

    if (
      !order.notes ||
      order.notes.feeId !== fee._id.toString() ||
      order.notes.studentId !== student._id.toString()
    ) {
      return res.status(400).json({
        message: "Payment order does not match this fee",
      });
    }

    const paymentAlreadyRecorded = fee.payments.some(
      (payment) =>
        payment.referenceNumber === razorpay_payment_id
    );

    if (paymentAlreadyRecorded) {
      return res.status(200).json({
        message: "Payment already recorded",
      });
    }

    const paidAmount = fee.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const currentBalance =
      fee.totalAmount - paidAmount;

    const orderAmount = Number(order.amount) / 100;

    if (
      currentBalance <= 0 ||
      orderAmount <= 0 ||
      orderAmount > currentBalance
    ) {
      return res.status(400).json({
        message: "Payment amount is invalid for this fee",
      });
    }

    const methodMap = {
  upi: "UPI",
  card: "Card",
  netbanking: "Bank Transfer",
};

const paymentMethod =
  methodMap[payment.method] || "Other";

fee.payments.push({
  amount: orderAmount,
  paymentMethod,
  referenceNumber: razorpay_payment_id,
  paymentDate: new Date(),
  recordedBy: req.user.id,
});

    await fee.save();

    return res.status(200).json({
      message: "Payment verified and recorded successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.error?.description ||
        error.message ||
        "Unable to verify payment",
    });
  }
};