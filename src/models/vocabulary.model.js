const { pool } = require('../config/db');

const VocabularyModel = {
  async getAll() {
    const res = await pool.query('SELECT * FROM vocabulary ORDER BY id ASC');
    return res.rows;
  },

  async getById(id) {
    const res = await pool.query('SELECT * FROM vocabulary WHERE id = $1', [id]);
    return res.rows[0];
  },

  async create(data) {
    const {
      kanji, kana, romaji, meaning, jlpt_level,
      audio_url, example, image_url, category_key
    } = data;
    const res = await pool.query(
      `INSERT INTO vocabulary (kanji, kana, romaji, meaning, jlpt_level, audio_url, example, image_url, category_key)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [kanji, kana, romaji, meaning, jlpt_level, audio_url, example, image_url, category_key]
    );
    return res.rows[0];
  },

  async update(id, data) {
    const {
      kanji, kana, romaji, meaning, jlpt_level,
      audio_url, example, image_url, category_key
    } = data;
    const res = await pool.query(
      `UPDATE vocabulary SET
        kanji=$1, kana=$2, romaji=$3, meaning=$4, jlpt_level=$5,
        audio_url=$6, example=$7, image_url=$8, category_key=$9
       WHERE id=$10 RETURNING *`,
      [kanji, kana, romaji, meaning, jlpt_level, audio_url, example, image_url, category_key, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM vocabulary WHERE id=$1', [id]);
    return true;
  },
};

module.exports = VocabularyModel;
