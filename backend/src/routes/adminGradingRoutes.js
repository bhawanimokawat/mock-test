
const express = require("express");
const { retryFailedGrading } = require("../controllers/adminGradingController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/attempts/:id/retry-grading",
  protect,
  authorizeRoles("admin"),
  retryFailedGrading
);

module.exports = router;
