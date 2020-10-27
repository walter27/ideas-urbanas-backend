const express = require('express');
const router = express.Router();
const chartsController = require('../controllers/charts');

// Routes of users
router.get('/', chartsController.getChartsTypes);
router.post('/image', chartsController.saveCharts);
router.get('/share/:image', chartsController.getImageShare);

module.exports = router