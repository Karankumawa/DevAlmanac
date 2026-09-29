const express = require('express');
const router = express.Router();
const {
  toggleLessonProgress,
  getProgressByTrack,
} = require('../controllers/progressController');

router.post('/toggle', toggleLessonProgress);
router.get('/:trackId', getProgressByTrack);

module.exports = router;
