const { gradeAttempt } = require("../services/attemptGradingService");
const pool = require("../config/db");

const retryFailedGrading = async (req, res, next) => {
  try {
    const attemptId = Number(req.params.id);

    if (!Number.isSafeInteger(attemptId) || attemptId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid attempt ID.",
      });
    }

    const attemptResult = await pool.query(
      `SELECT id, status FROM test_attempts
       WHERE id = $1 AND status IN ('grading', 'submitted')`,
      [attemptId]
    );

    if (!attemptResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Pending grading attempt not found.",
      });
    }

    const grading = await gradeAttempt(attemptId);

    return res.status(200).json({
      success: true,
      message: "Grading retry processed.",
      grading,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { retryFailedGrading };
