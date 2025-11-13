const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
const requireAdmin = require('../middleware/requireAdmin');

// CRUD
router.get('/', CategoryController.getAll);
router.get('/:key', CategoryController.getByKey);
router.post('/', requireAdmin, CategoryController.create);
router.put('/:key', requireAdmin, CategoryController.update);
router.delete('/:key', requireAdmin, CategoryController.delete);

module.exports = router;
