const express = require('express');
const router = express.Router();
const chartsController = require('../controllers/charts');

// Routes of users
router.get('/', chartsController.getChartsTypes);
router.post('/image', chartsController.saveCharts);
router.post('/share', chartsController.shareChart);
router.get('/share/:image', chartsController.getImageShare);
router.post('/sharing', chartsController.saveImage24)

module.exports = router