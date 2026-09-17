const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createFee,
  getAllFees,
  recordPayment,
  getMyFees,
} = require("../controllers/feeController");

// Student - view own fees
router.get(
  "/me",
  authMiddleware,
  getMyFees
);

// Admin - view all fee records
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllFees
);

// Admin - create fee record
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createFee
);

// Admin - record a payment
router.post(
  "/:feeId/payments",
  authMiddleware,
  adminMiddleware,
  recordPayment
);

module.exports = router;