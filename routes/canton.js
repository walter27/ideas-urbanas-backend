const express = require('express');
const router = express.Router();
const cantonController = require('../controllers/canton');

// Routes of users
router.post('/filter/:id?', cantonController.getCantons);
router.post('/', cantonController.addCanton);
router.put('/:id', cantonController.updateCanton);
router.delete('/:id', cantonController.deleteCanton);

module.exports = router