const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progress.controller');

// Lấy tiến trình học của user
router.get('/:user_id', ProgressController.getUserProgress);

// Đánh dấu đã học / chưa học
router.post('/learned', ProgressController.markLearned);

// Đánh dấu đã thuộc / chưa thuộc
router.post('/mastered', ProgressController.markMastered);

module.exports = router;
