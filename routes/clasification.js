const express = require('express');
const router = express.Router();
const clasificationController = require('../controllers/clasification');

const formidable = require('express-formidable');

// Routes of clasifications
router.post('/', formidable(), clasificationController.addClasification);
router.put('/:id', formidable(), clasificationController.updateClasification);
router.delete('/:id', clasificationController.deleteClasification);

module.exports = router