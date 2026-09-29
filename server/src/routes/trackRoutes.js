const express = require('express');
const router = express.Router();
const { getAllTracks, getTrackBySlug } = require('../controllers/trackController');

router.get('/', getAllTracks);
router.get('/:slug', getTrackBySlug);

module.exports = router;
