const express = require('express');
const router = express.Router();
const indicatorController = require('../controllers/indicator');

// Routes of users
router.post('/', indicatorController.addIndicator);
router.put('/:id', indicatorController.updateIndicator);
router.delete('/:id', indicatorController.deleteIndicator);

module.exports = router