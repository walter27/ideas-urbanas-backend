const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data');

// Routes of users
router.post('/filter/:id?', dataController.getDatas);
router.post('/', dataController.addData);
router.put('/:id', dataController.updateData);
router.delete('/:id', dataController.deleteData);

module.exports = router