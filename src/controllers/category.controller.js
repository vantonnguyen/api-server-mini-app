const CategoryModel = require('../models/category.model');

const CategoryController = {
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page);
      const pageSize = parseInt(req.query.pageSize);
      if (page && pageSize) {
        const { data, total } = await CategoryModel.getPaged(page, pageSize);
        res.json({ success: true, data, total });
      } else {
        const categories = await CategoryModel.getAll();
        res.json({ success: true, data: categories });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getByKey(req, res) {
    try {
      const category = await CategoryModel.getByKey(req.params.key);
      res.json({ success: true, data: category });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async add(req, res) {
    try {
      const existed = await CategoryModel.getByKey(req.body.key);
      if (existed) {
        return res.status(409).json({ success: false, message: 'Duplicate key: category already exists.' });
      }
      const category = await CategoryModel.add(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const category = await CategoryModel.update(req.params.key, req.body);
      res.json({ success: true, data: category });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await CategoryModel.delete(req.params.key);
      if (result) {
        res.json({ success: true, message: 'Category deleted' });
      } else {
        res.status(404).json({ success: false, message: 'Category not found' });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = CategoryController;
