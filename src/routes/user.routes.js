const express = require('express');
const router = express.Router();
const ZaloUserController = require('../controllers/zaloUser.controller');

router.get('/', ZaloUserController.getAll);
router.get('/:zaloId', ZaloUserController.getByZaloId);
router.post('/', ZaloUserController.create);
router.put('/:zaloId', ZaloUserController.update);
router.delete('/:zaloId', ZaloUserController.delete);

module.exports = router;
