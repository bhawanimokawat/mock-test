
const pool = require("../config/db");

const startAttempt = async ({ userId, passageId }) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Lock and verify the published passage.
        const passageResult = await client.query(
            `SELECT id, duration_minutes
             FROM passages
             WHERE id = $1 AND is_published = TRUE
             FOR SHARE`,
            [passageId]
        );

        if (passageResult.rows.length === 0) {
            const error = new Error("Passage not found or not published.");
            error.statusCode = 404;
            throw error;
        }

        // A student cannot start another attempt while one is active.
        const activeResult = await client.query(
            `SELECT id
             FROM test_attempts
             WHERE user_id = $1
               AND status = 'in_progress'
               AND deadline_at > NOW()
             LIMIT 1
             FOR UPDATE`,
            [userId]
        );

        if (activeResult.rows.length > 0) {
            const error = new Error(
                "You already have an active test attempt."
            );
            error.statusCode = 409;
            throw error;
        }

        const passage = passageResult.rows[0];

        const attemptResult = await client.query(
            `INSERT INTO test_attempts
                (user_id, passage_id, started_at, deadline_at, max_score)
             SELECT
                $1,
                $2,
                NOW(),
                NOW() + ($3 * INTERVAL '1 minute'),
                COALESCE(SUM(q.max_marks), 0)
             FROM questions q
             WHERE q.passage_id = $2
             RETURNING id, user_id, passage_id, started_at,
                       deadline_at, status, max_score`,
            [userId, passageId, passage.duration_minutes]
        );

        const attempt = attemptResult.rows[0];

        if (Number(attempt.max_score) <= 0) {
            const error = new Error(
                "This passage has no questions available."
            );
            error.statusCode = 400;
            throw error;
        }

        // Create an empty answer record for every question.
        await client.query(
            `INSERT INTO student_answers (attempt_id, question_id)
             SELECT $1, id
             FROM questions
             WHERE passage_id = $2`,
            [attempt.id, passageId]
        );

        await client.query("COMMIT");

        return attempt;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getAttemptById = async ({ attemptId, userId }) => {
    const result = await pool.query(
        `SELECT id, user_id, passage_id, started_at,
                deadline_at, submitted_at, status, max_score
         FROM test_attempts
         WHERE id = $1 AND user_id = $2`,
        [attemptId, userId]
    );

    return result.rows[0] || null;
};

module.exports = {
    startAttempt,
    getAttemptById
};
