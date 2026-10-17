const pool = require("../config/db");

const getAttemptResult = async (req, res, next) => {
  try {
    const attemptId = Number(req.params.id);

    if (!Number.isSafeInteger(attemptId) || attemptId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid attempt ID.",
      });
    }

    const attemptResult = await pool.query(
      `SELECT
         ta.id, ta.user_id, ta.passage_id,
         ta.started_at, ta.deadline_at, ta.submitted_at,
         ta.status, ta.objective_score, ta.ai_score,
         ta.total_score, ta.max_score,
         p.title AS passage_title
       FROM test_attempts ta
       JOIN passages p ON p.id = ta.passage_id
       WHERE ta.id = $1 AND ta.user_id = $2`,
      [attemptId, req.user.id]
    );

    if (!attemptResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Test result not found.",
      });
    }

    const attempt = attemptResult.rows[0];

    if (attempt.status === "in_progress") {
      return res.status(409).json({
        success: false,
        message: "Submit the test before viewing results.",
      });
    }

    const answersResult = await pool.query(
      `SELECT
         q.id AS question_id,
         q.question_text,
         q.question_type,
         q.options,
         q.correct_answer,
         q.max_marks,
         q.question_order,
         sa.answer_text,
         sa.awarded_marks,
         sa.ai_feedback,
         sa.grading_status
       FROM student_answers sa
       JOIN questions q ON q.id = sa.question_id
       WHERE sa.attempt_id = $1
       ORDER BY q.question_order`,
      [attemptId]
    );

    return res.status(200).json({
      success: true,
      result: {
        ...attempt,
        objectiveScore: Number(attempt.objective_score),
        aiScore: Number(attempt.ai_score),
        totalScore: Number(attempt.total_score),
        maxScore: Number(attempt.max_score),
        answers: answersResult.rows.map((answer) => ({
          ...answer,
          awarded_marks: Number(answer.awarded_marks),
          max_marks: Number(answer.max_marks),
          // Do not reveal model answers while grading is incomplete.
          correct_answer:
            answer.grading_status === "graded"
              ? answer.correct_answer
              : null,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAttemptHistory = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         ta.id, ta.passage_id, p.title AS passage_title,
         ta.started_at, ta.submitted_at, ta.status,
         ta.objective_score, ta.ai_score,
         ta.total_score, ta.max_score
       FROM test_attempts ta
       JOIN passages p ON p.id = ta.passage_id
       WHERE ta.user_id = $1
         AND ta.status <> 'in_progress'
       ORDER BY ta.started_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      attempts: result.rows.map((attempt) => ({
        ...attempt,
        objective_score: Number(attempt.objective_score),
        ai_score: Number(attempt.ai_score),
        total_score: Number(attempt.total_score),
        max_score: Number(attempt.max_score),
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAttemptResult, getAttemptHistory };
