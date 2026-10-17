
const express = require("express");
const {
  getAdminDashboard,
  getStudentReports,
} = require("../controllers/adminController");
const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/dashboard", getAdminDashboard);
router.get("/students", getStudentReports);

module.exports = router;
