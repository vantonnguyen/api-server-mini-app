const express = require('express');
const router = express.Router();
const VocabularyController = require('../controllers/vocabulary.controller');

// CRUD
router.get('/', VocabularyController.getAll);
router.get('/:id', VocabularyController.getById);
router.post('/', VocabularyController.create);
router.put('/:id', VocabularyController.update);
router.delete('/:id', VocabularyController.delete);

module.exports = router;
