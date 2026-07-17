const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

// Create Notice (Admin)
router.post("/", authMiddleware, adminMiddleware, createNotice);

// Get All Notices
router.get("/", authMiddleware, getAllNotices);

// Get One Notice
router.get("/:id", authMiddleware, getNoticeById);

// Update Notice (Admin)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateNotice
);

// Delete Notice (Admin)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteNotice
);

module.exports = router;