const CategoryModel = require('../models/category.model');

const CategoryController = {
  async getAll(req, res) {
    try {
      const categories = await CategoryModel.getAll();
      res.json({ success: true, data: categories });
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

  async create(req, res) {
    try {
      const category = await CategoryModel.create(req.body);
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
