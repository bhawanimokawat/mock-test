
const pool = require("../config/db");

const getAdminDashboard = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users
         WHERE role = 'student') AS total_students,

        (SELECT COUNT(*) FROM passages
         WHERE is_published = TRUE) AS published_passages,

        (SELECT COUNT(*) FROM test_attempts
         WHERE status <> 'in_progress') AS total_attempts,

        (SELECT COUNT(*) FROM test_attempts
         WHERE status = 'graded') AS completed_attempts,

        (SELECT COUNT(*) FROM test_attempts
         WHERE status = 'grading') AS grading_attempts,

        (SELECT COUNT(*) FROM student_answers
         WHERE grading_status IN ('pending', 'failed')) AS pending_answers,

        (SELECT COALESCE(ROUND(AVG(total_score), 2), 0)
         FROM test_attempts
         WHERE status = 'graded') AS average_score
    `);

    const stats = result.rows[0];

    return res.status(200).json({
      success: true,
      dashboard: {
        totalStudents: Number(stats.total_students),
        publishedPassages: Number(stats.published_passages),
        totalAttempts: Number(stats.total_attempts),
        completedAttempts: Number(stats.completed_attempts),
        gradingAttempts: Number(stats.grading_attempts),
        pendingAnswers: Number(stats.pending_answers),
        averageScore: Number(stats.average_score),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getStudentReports = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id AS student_id,
        u.name,
        u.email,
        u.created_at AS registered_at,
        COUNT(ta.id) FILTER (
          WHERE ta.status <> 'in_progress'
        ) AS attempts,
        COUNT(ta.id) FILTER (
          WHERE ta.status = 'graded'
        ) AS graded_attempts,
        COALESCE(
          ROUND(AVG(ta.total_score) FILTER (
            WHERE ta.status = 'graded'
          ), 2), 0
        ) AS average_score
      FROM users u
      LEFT JOIN test_attempts ta ON ta.user_id = u.id
      WHERE u.role = 'student'
      GROUP BY u.id, u.name, u.email, u.created_at
      ORDER BY u.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      students: result.rows.map((student) => ({
        ...student,
        attempts: Number(student.attempts),
        graded_attempts: Number(student.graded_attempts),
        average_score: Number(student.average_score),
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminDashboard, getStudentReports };
