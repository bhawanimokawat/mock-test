
const { startAttempt } = require("../models/attemptModel");
const { gradeAttempt } = require("../services/attemptGradingService");

const startTestAttempt = async (req, res, next) => {
    try {
        const { passageId } = req.body;

        const id = Number(passageId);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "A valid passageId is required."
            });
        }

        const attempt = await startAttempt({
            userId: req.user.id,
            passageId: id
        });

        return res.status(201).json({
            success: true,
            message: "Test started successfully.",
            attempt: {
                id: attempt.id,
                passageId: attempt.passage_id,
                startedAt: attempt.started_at,
                deadlineAt: attempt.deadline_at,
                status: attempt.status,
                maxScore: Number(attempt.max_score)
            }
        });
    } catch (error) {
        next(error);
    }
};



const pool = require("../config/db");

const getAttemptQuestions = async (req, res, next) => {
    try {
        const attemptId = Number(req.params.id);

        if (!Number.isSafeInteger(attemptId) || attemptId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid attempt ID."
            });
        }

        const attemptResult = await pool.query(
            `SELECT a.id, a.passage_id, a.started_at, a.deadline_at,
                    a.status, p.title, p.content
             FROM test_attempts a
             JOIN passages p ON p.id = a.passage_id
             WHERE a.id = $1 AND a.user_id = $2`,
            [attemptId, req.user.id]
        );

        if (!attemptResult.rows.length) {
            return res.status(404).json({
                success: false,
                message: "Test attempt not found."
            });
        }

        const attempt = attemptResult.rows[0];

        if (
            attempt.status === "in_progress" &&
            new Date(attempt.deadline_at).getTime() <= Date.now()
        ) {
            return res.status(409).json({
                success: false,
                message: "Time is over. Submit your test now.",
                timeExpired: true,
            });
        }

        const questionsResult = await pool.query(
            `SELECT
                q.id,
                q.question_text,
                q.question_type,
                q.options,
                q.max_marks,
                q.question_order,
                sa.answer_text
             FROM questions q
             JOIN student_answers sa
               ON sa.question_id = q.id
              AND sa.attempt_id = $1
             WHERE q.passage_id = $2
             ORDER BY q.question_order`,
            [attemptId, attempt.passage_id]
        );

        return res.status(200).json({
            success: true,
            attempt: {
                id: attempt.id,
                status: attempt.status,
                startedAt: attempt.started_at,
                deadlineAt: attempt.deadline_at
            },
            passage: {
                id: attempt.passage_id,
                title: attempt.title,
                content: attempt.content
            },
            questions: questionsResult.rows
        });
    } catch (error) {
        next(error);
    }
};

const saveAnswer = async (req, res, next) => {
    try {
        const attemptId = Number(req.params.id);
        const questionId = Number(req.params.questionId);
        const { answer } = req.body;

        if (
            !Number.isSafeInteger(attemptId) || attemptId <= 0 ||
            !Number.isSafeInteger(questionId) || questionId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid attempt or question ID."
            });
        }

        if (typeof answer !== "string" || answer.length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Answer must be text with a maximum of 5000 characters."
            });
        }

        const result = await pool.query(
            `UPDATE student_answers sa
             SET answer_text = $1,
                 answered_at = NOW(),
                 updated_at = NOW()
             FROM test_attempts a
             WHERE sa.attempt_id = a.id
               AND sa.attempt_id = $2
               AND sa.question_id = $3
               AND a.user_id = $4
               AND a.status = 'in_progress'
               AND a.deadline_at > NOW()
             RETURNING sa.question_id, sa.answer_text, sa.answered_at`,
            [answer, attemptId, questionId, req.user.id]
        );

        if (!result.rows.length) {
            return res.status(409).json({
                success: false,
                message: "Answer not saved. Attempt may have expired, ended, or the question is invalid."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Answer saved.",
            answer: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};



const submitTestAttempt = async (req, res, next) => {
    let client;

    try {
        const attemptId = Number(req.params.id);

        if (!Number.isSafeInteger(attemptId) || attemptId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid attempt ID.",
            });
        }

        client = await pool.connect();
        await client.query("BEGIN");

        const attemptResult = await client.query(
            `SELECT id, status, deadline_at
       FROM test_attempts
       WHERE id = $1 AND user_id = $2
       FOR UPDATE`,
            [attemptId, req.user.id]
        );

        if (!attemptResult.rows.length) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Test attempt not found.",
            });
        }

        const attempt = attemptResult.rows[0];

        // Repeated submission must never calculate or add marks again.
        if (attempt.status !== "in_progress") {
            await client.query("COMMIT");

            return res.status(200).json({
                success: true,
                message: "This test has already been submitted.",
                attemptId,
                status: attempt.status,
            });
        }

        const answersResult = await client.query(
            `SELECT
         q.id AS question_id,
         q.question_type,
         q.correct_answer,
         q.max_marks,
         sa.answer_text
       FROM student_answers sa
       JOIN questions q ON q.id = sa.question_id
       WHERE sa.attempt_id = $1
       ORDER BY q.question_order`,
            [attemptId]
        );

        let objectiveScore = 0;
        let maxScore = 0;
        let shortAnswerCount = 0;

        for (const item of answersResult.rows) {
            const maxMarks = Number(item.max_marks);
            const answer = (item.answer_text || "").trim();

            maxScore += maxMarks;

            if (item.question_type === "short_answer") {
                shortAnswerCount++;

                await client.query(
                    `UPDATE student_answers
           SET awarded_marks = 0,
               grading_status = 'pending',
               ai_feedback = NULL,
               graded_at = NULL,
               updated_at = NOW()
           WHERE attempt_id = $1 AND question_id = $2`,
                    [attemptId, item.question_id]
                );

                continue;
            }

            const expected = (item.correct_answer || "").trim();

            const isCorrect =
                answer !== "" &&
                expected !== "" &&
                answer.toLowerCase() === expected.toLowerCase();

            const marks = isCorrect ? maxMarks : 0;
            objectiveScore += marks;

            await client.query(
                `UPDATE student_answers
         SET awarded_marks = $1,
             grading_status = 'graded',
             updated_at = NOW()
         WHERE attempt_id = $2 AND question_id = $3`,
                [marks, attemptId, item.question_id]
            );
        }

        const initialStatus =
            shortAnswerCount > 0 ? "grading" : "graded";

        await client.query(
            `UPDATE test_attempts
       SET submitted_at = NOW(),
           status = $1,
           objective_score = $2,
           ai_score = 0,
           total_score = $2,
           max_score = $3
       WHERE id = $4`,
            [initialStatus, objectiveScore, maxScore, attemptId]
        );

        await client.query("COMMIT");

        // Release the database connection before calling Gemini.
        client.release();
        client = null;

        if (shortAnswerCount === 0) {
            return res.status(200).json({
                success: true,
                message: "Test submitted and graded successfully.",
                attemptId,
                grading: {
                    status: "graded",
                    objectiveScore,
                    aiScore: 0,
                    totalScore: objectiveScore,
                },
            });
        }

        try {
            const grading = await gradeAttempt(attemptId);

            return res.status(200).json({
                success: true,
                message:
                    grading.status === "graded"
                        ? "Test submitted and graded successfully."
                        : "Test submitted. Some answers need grading retry.",
                attemptId,
                grading,
            });
        } catch (gradingError) {
            console.error("Gemini grading error:", gradingError.message);

            return res.status(200).json({
                success: true,
                message: "Test submitted. Grading is pending.",
                attemptId,
                grading: { status: "grading" },
            });
        }
    } catch (error) {
        if (client) {
            await client.query("ROLLBACK").catch(() => { });
        }

        next(error);
    } finally {
        if (client) client.release();
    }
};



module.exports = {
    startTestAttempt,
    getAttemptQuestions,
    saveAnswer, submitTestAttempt
};

