const express = require('express');
const router = express.Router();
const researchController = require('../controllers/research');

const formidable = require('express-formidable');

// Routes of researchs
router.post('/', formidable(), researchController.addResearch);
router.put('/:id', formidable(), researchController.updateResearch);
router.delete('/:id', researchController.deleteResearch);

module.exports = router