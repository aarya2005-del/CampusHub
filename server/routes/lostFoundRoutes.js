const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createReport,
  getAllReports,
  resolveReport,
  deleteReport,
} = require("../controllers/lostFoundController");

router.get(
  "/",
  authMiddleware,
  getAllReports
);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createReport
);
router.patch(
  "/:reportId/resolve",
  authMiddleware,
  resolveReport
);
router.delete(
  "/:reportId",
  authMiddleware,
  adminMiddleware,
  deleteReport
);
module.exports = router;