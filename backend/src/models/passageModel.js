const pool = require("../config/db");

const getPublishedPassages = async () => {
    const query = `
        SELECT
            p.id,
            p.title,
            p.duration_minutes,
            COUNT(q.id)::INTEGER AS question_count
        FROM passages p
        LEFT JOIN questions q ON q.passage_id = p.id
        WHERE p.is_published = TRUE
        GROUP BY p.id
        ORDER BY p.id ASC
    `;

    const result = await pool.query(query);

    return result.rows;
};

const getPassageById = async (id) => {
    const query = `
        SELECT
            id,
            title,
            content,
            duration_minutes
        FROM passages
        WHERE id = $1
          AND is_published = TRUE
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
};

module.exports = {
    getPublishedPassages,
    getPassageById,
};
