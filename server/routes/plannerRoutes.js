const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createPlannerItem,
  getMyPlanner,
  updatePlannerItem,
  deletePlannerItem,
} = require("../controllers/plannerController");

// Get logged-in student's planner
router.get(
  "/me",
  authMiddleware,
  getMyPlanner
);

// Create planner item
router.post(
  "/",
  authMiddleware,
  createPlannerItem
);

// Update own planner item
router.put(
  "/:id",
  authMiddleware,
  updatePlannerItem
);

// Delete own planner item
router.delete(
  "/:id",
  authMiddleware,
  deletePlannerItem
);

module.exports = router;