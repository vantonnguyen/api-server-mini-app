const { pool } = require('../config/db');

const FavoriteVocabularyModel = {
  async getUserFavorites(zalo_id) {
    const res = await pool.query(
      `SELECT f.*, v.meaning, v.kanji, v.kana, v.romaji
       FROM favorite_vocabulary f
       JOIN vocabulary v ON f.vocabulary_id = v.id
       WHERE f.zalo_id = $1`,
      [zalo_id]
    );
    return res.rows;
  },

  async addFavorite(zalo_id, vocabulary_id) {
    const res = await pool.query(
      `INSERT INTO favorite_vocabulary (zalo_id, vocabulary_id)
       VALUES ($1, $2) ON CONFLICT (zalo_id, vocabulary_id) DO NOTHING
       RETURNING *`,
      [zalo_id, vocabulary_id]
    );
    return res.rows[0];
  },

  async removeFavorite(zalo_id, vocabulary_id) {
    await pool.query(
      `DELETE FROM favorite_vocabulary
       WHERE zalo_id=$1 AND vocabulary_id=$2`,
      [zalo_id, vocabulary_id]
    );
    return true;
  },
};

module.exports = FavoriteVocabularyModel;
