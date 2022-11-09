const express = require('express');
const router = express.Router();
const wordController = require('../controllers/word');

const formidable = require('express-formidable');


// Routes of tags
router.post('/filter', wordController.getWords);
router.post('/text', wordController.getWord);
router.post('/', wordController.addWord);
router.delete('/:id', wordController.deleteWord);
router.put('/:id', wordController.updateWord);
router.post('/loadWordsJSON', formidable(), wordController.loadWordsJSON);
router.post('/loadTagsJSON', formidable(), wordController.loadTagsJSON);
router.post('/deleteTagWordJSON', formidable(), wordController.deleteTagWordJSON);


module.exports = router