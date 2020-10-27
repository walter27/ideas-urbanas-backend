const express = require('express');
const router = express.Router();
const variableController = require('../controllers/variable');

const formidable = require('express-formidable');


// Routes of users
router.post('/', formidable(), variableController.addVariable);
router.put('/:id', formidable(), variableController.updateVariable);
router.delete('/:id', variableController.deleteVariable);

module.exports = router