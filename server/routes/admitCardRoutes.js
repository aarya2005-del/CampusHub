const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getMyAdmitCard,
} = require("../controllers/admitCardController");

// Student - get own admit card
router.get(
  "/me",
  authMiddleware,
  getMyAdmitCard
);

module.exports = router;