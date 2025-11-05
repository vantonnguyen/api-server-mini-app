const { pool } = require('../config/db');

const FavoriteVocabularyModel = {
  async getUserFavorites(user_id) {
    const res = await pool.query(
      `SELECT f.*, v.meaning, v.kanji, v.kana, v.romaji
       FROM favorite_vocabulary f
       JOIN vocabulary v ON f.vocabulary_id = v.id
       WHERE f.user_id = $1`,
      [user_id]
    );
    return res.rows;
  },

  async addFavorite(user_id, vocabulary_id) {
    const res = await pool.query(
      `INSERT INTO favorite_vocabulary (user_id, vocabulary_id)
       VALUES ($1, $2) ON CONFLICT (user_id, vocabulary_id) DO NOTHING
       RETURNING *`,
      [user_id, vocabulary_id]
    );
    return res.rows[0];
  },

  async removeFavorite(user_id, vocabulary_id) {
    await pool.query(
      `DELETE FROM favorite_vocabulary
       WHERE user_id=$1 AND vocabulary_id=$2`,
      [user_id, vocabulary_id]
    );
    return true;
  },
};

module.exports = FavoriteVocabularyModel;
