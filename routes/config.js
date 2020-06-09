const express = require('express');
const router = express.Router();
const configController = require('../controllers/config');


// Routes of configs
router.post('/', configController.addConfig);
router.get('/:id?', configController.getConfigs);
router.put('/:id', configController.updateConfig);
router.delete('/:id', configController.deleteConfig);

module.exports = router