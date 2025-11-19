const VocabularyModel = require("../models/vocabulary.model");

const VocabularyController = {
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page);
      const pageSize = parseInt(req.query.pageSize);
      if (page && pageSize) {
        const { data, total } = await VocabularyModel.getPaged(page, pageSize);
        res.json({ success: true, data, total });
      } else {
        const vocabularies = await VocabularyModel.getAll();
        res.json({ success: true, data: vocabularies });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const vocabulary = await VocabularyModel.getById(req.params.id);
      res.json({ success: true, data: vocabulary });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getByCategory(req, res) {
    try {
      const key = req.query.category; // lấy theo query param ?category=fruits
      const vocabularies = await VocabularyModel.getByCategoryKey(key);
      res.json({ success: true, data: vocabularies });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const vocabulary = await VocabularyModel.create(req.body);
      res.status(201).json({ success: true, data: vocabulary });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const vocabulary = await VocabularyModel.update(req.params.id, req.body);
      res.json({ success: true, data: vocabulary });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await VocabularyModel.delete(req.params.id);
      res.json({ success: true, message: "Vocabulary deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = VocabularyController;
