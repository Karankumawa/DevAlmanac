const express = require('express');
const router = express.Router();
const { getLessonBySlug } = require('../controllers/lessonController');

router.get('/:trackSlug/:lessonSlug', getLessonBySlug);

module.exports = router;
