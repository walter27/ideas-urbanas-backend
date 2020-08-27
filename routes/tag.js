const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag');

// Routes of tags
router.post('/filter', tagController.getTags);
router.post('/', tagController.addTag);
router.delete('/:id', tagController.deleteTag);
router.put('/:id', tagController.updateTag);
router.put('/stopwords/:id', tagController.updateStopWords)

module.exports = router