
const express = require("express");
const {
  getAttemptResult,
  getAttemptHistory,
} = require("../controllers/resultController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/history", protect, getAttemptHistory);
router.get("/:id/result", protect, getAttemptResult);

module.exports = router;
