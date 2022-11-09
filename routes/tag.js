const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag');

// Routes of tags
router.put('/stopwords/:id', tagController.updateStopWords)

module.exports = router