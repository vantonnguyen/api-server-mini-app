const { pool } = require("../config/db");
const { get } = require("../routes/category.routes");

const CategoryModel = {
  async getAll() {
    const res = await pool.query("SELECT * FROM category ORDER BY id ASC");
    return res.rows;
  },

  async getPaged(page, pageSize) {
    const offset = (page - 1) * pageSize;
    const dataRes = await pool.query(
      "SELECT * FROM category ORDER BY display_order ASC LIMIT $1 OFFSET $2",
      [pageSize, offset]
    );
    const totalRes = await pool.query("SELECT COUNT(*) FROM category");
    return {
      data: dataRes.rows,
      total: parseInt(totalRes.rows[0].count),
    };
  },

  async getByKey(key) {
    const res = await pool.query("SELECT * FROM category WHERE key = $1", [
      key,
    ]);
    return res.rows[0];
  },

  async add({ key, label, color, japanese, kana, romaji, display_order }) {
    const res = await pool.query(
      `INSERT INTO category (key, label, color, japanese, kana, romaji, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [key, label, color, japanese, kana, romaji, display_order]
    );
    return res.rows[0];
  },

  async update(key, { label, color, japanese, kana, romaji, display_order }) {
    const res = await pool.query(
      `UPDATE category
       SET label=$1, color=$2, japanese=$3, kana=$4, romaji=$5, display_order=$6
       WHERE key=$7 RETURNING *`,
      [label, color, japanese, kana, romaji, display_order, key]
    );
    return res.rows[0];
  },

  async delete(key) {
    if (
      (await this.getByKey(key).length) === 0 ||
      (await this.getByKey(key)) == null ||
      (await this.getByKey(key)) == undefined
    ) {
      console.log("Category not found");
      return false;
    } else {
      await pool.query("DELETE FROM category WHERE key=$1", [key]);
      return true;
    }
  },
};

module.exports = CategoryModel;
