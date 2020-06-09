const express = require('express');
const router = express.Router();
const provinciaController = require('../controllers/provincia');

// Routes of provincias
router.post('/filter/:id?', provinciaController.getProvincias);
router.post('/', provinciaController.addProvincia);
router.put('/:id', provinciaController.updateProvincia);
router.delete('/:id', provinciaController.deleteProvincia);

module.exports = router