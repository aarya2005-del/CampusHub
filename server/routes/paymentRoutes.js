const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

// Student - create Razorpay order for own fee
router.post(
  "/create-order/:feeId",
  authMiddleware,
  createPaymentOrder
);

// Student - verify completed Razorpay payment
router.post(
  "/verify",
  authMiddleware,
  verifyPayment
);

module.exports = router;