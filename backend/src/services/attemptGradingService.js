const pool = require("../config/db");
const { gradeShortAnswer } = require("./aiGradingService");

const gradeAttempt = async (attemptId) => {
  const attemptResult = await pool.query(
    `SELECT ta.id, ta.passage_id, ta.status, p.content
     FROM test_attempts ta
     JOIN passages p ON p.id = ta.passage_id
     WHERE ta.id = $1`,
    [attemptId]
  );

  if (!attemptResult.rows.length) {
    throw new Error("Test attempt not found.");
  }

  const attempt = attemptResult.rows[0];

  const answersResult = await pool.query(
    `SELECT
       sa.id AS answer_id,
       sa.answer_text,
       sa.grading_status,
       q.id AS question_id,
       q.question_text,
       q.correct_answer,
       q.ai_rubric,
       q.max_marks
     FROM student_answers sa
     JOIN questions q ON q.id = sa.question_id
     WHERE sa.attempt_id = $1
       AND q.question_type = 'short_answer'
       AND sa.grading_status IN ('pending', 'failed')
     ORDER BY q.question_order`,
    [attemptId]
  );

  for (const item of answersResult.rows) {
    // An unanswered question receives zero marks.
    if (!item.answer_text || !item.answer_text.trim()) {
      await pool.query(
        `UPDATE student_answers
         SET awarded_marks = 0,
             ai_feedback = 'No answer was provided.',
             grading_status = 'graded',
             graded_at = NOW(),
             updated_at = NOW()
         WHERE id = $1`,
        [item.answer_id]
      );
      continue;
    }

    try {
      const result = await gradeShortAnswer({
        passage: attempt.content,
        question: item.question_text,
        expectedAnswer: item.correct_answer,
        rubric: item.ai_rubric,
        studentAnswer: item.answer_text,
        maxMarks: Number(item.max_marks),
      });

      await pool.query(
        `UPDATE student_answers
         SET awarded_marks = $1,
             ai_feedback = $2,
             grading_status = 'graded',
             graded_at = NOW(),
             updated_at = NOW()
         WHERE id = $3`,
        [result.marks, result.feedback, item.answer_id]
      );
    } catch (error) {
      // Preserve the answer so grading can be retried later.
      console.error(
        `AI grading failed for answer ${item.answer_id}:`,
        error.message
      );

      await pool.query(
        `UPDATE student_answers
         SET grading_status = 'failed',
             ai_feedback = 'Grading is temporarily unavailable. Please retry.',
             updated_at = NOW()
         WHERE id = $1`,
        [item.answer_id]
      );
    }
  }

  // Recalculate scores from database values, not AI totals.
  const scoreResult = await pool.query(
    `SELECT
       COALESCE(SUM(
         CASE WHEN q.question_type <> 'short_answer'
         THEN sa.awarded_marks ELSE 0 END
       ), 0) AS objective_score,
       COALESCE(SUM(
         CASE WHEN q.question_type = 'short_answer'
         THEN sa.awarded_marks ELSE 0 END
       ), 0) AS ai_score,
       COUNT(*) FILTER (
         WHERE q.question_type = 'short_answer'
           AND sa.grading_status <> 'graded'
       ) AS remaining
     FROM student_answers sa
     JOIN questions q ON q.id = sa.question_id
     WHERE sa.attempt_id = $1`,
    [attemptId]
  );

  const scores = scoreResult.rows[0];
  const objectiveScore = Number(scores.objective_score);
  const aiScore = Number(scores.ai_score);
  const isGraded = Number(scores.remaining) === 0;

  await pool.query(
    `UPDATE test_attempts
     SET objective_score = $1,
         ai_score = $2,
         total_score = $1 + $2,
         status = $3
     WHERE id = $4
       AND status IN ('grading', 'submitted')`,
    [
      objectiveScore,
      aiScore,
      isGraded ? "graded" : "grading",
      attemptId,
    ]
  );

  return {
    status: isGraded ? "graded" : "grading",
    objectiveScore,
    aiScore,
    totalScore: objectiveScore + aiScore,
  };
};

module.exports = { gradeAttempt };
