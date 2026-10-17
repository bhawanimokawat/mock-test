const express = require("express");
const { startTestAttempt,getAttemptQuestions,submitTestAttempt,saveAnswer } = require("../controllers/attemptController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/start", protect, startTestAttempt);
router.get("/:id/questions", protect, getAttemptQuestions);
router.put("/:id/answers/:questionId", protect, saveAnswer);
router.post("/:id/submit", protect, submitTestAttempt);

module.exports = router;
