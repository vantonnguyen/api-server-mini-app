const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');

// CRUD
router.get('/', CategoryController.getAll);
router.get('/:key', CategoryController.getByKey);
router.post('/', CategoryController.create);
router.put('/:key', CategoryController.update);
router.delete('/:key', CategoryController.delete);

module.exports = router;
