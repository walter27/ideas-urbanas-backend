const express = require('express');
const router = express.Router();
const variableController = require('../controllers/variable');

// Routes of users
router.post('/', variableController.addVariable);
router.put('/:id', variableController.updateVariable);
router.delete('/:id', variableController.deleteVariable);

module.exports = router