const { pool } = require('../config/db');

const LearningProgressModel = {
  async getUserProgress(user_id) {
    const res = await pool.query(
      `SELECT l.*, v.meaning, v.kana, v.romaji
       FROM learning_progress l
       JOIN vocabulary v ON l.vocabulary_id = v.id
       WHERE l.user_id = $1`,
      [user_id]
    );
    return res.rows;
  },

  async markLearned(user_id, vocabulary_id, is_learned = true) {
    const res = await pool.query(
      `INSERT INTO learning_progress (user_id, vocabulary_id, is_learned)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, vocabulary_id)
       DO UPDATE SET is_learned = EXCLUDED.is_learned
       RETURNING *`,
      [user_id, vocabulary_id, is_learned]
    );
    return res.rows[0];
  },

  async markMastered(user_id, vocabulary_id, mastered = true) {
    const res = await pool.query(
      `UPDATE learning_progress
       SET mastered = $1
       WHERE user_id = $2 AND vocabulary_id = $3
       RETURNING *`,
      [mastered, user_id, vocabulary_id]
    );
    return res.rows[0];
  },
};

module.exports = LearningProgressModel;
