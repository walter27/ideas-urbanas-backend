const express = require('express');
const router = express.Router();
const originController = require('../controllers/origin');

// Routes of origins
router.post('/', originController.addOrigin);
router.put('/:id', originController.updateOrigin);
router.delete('/:id', originController.deleteOrigin);

module.exports = router