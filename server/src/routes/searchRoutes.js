const express = require('express');
const router = express.Router();
const { searchCurriculum } = require('../controllers/searchController');

router.get('/', searchCurriculum);

module.exports = router;
