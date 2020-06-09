const express = require('express');
const router = express.Router();
const chartsController = require('../controllers/charts');

// Routes of users
router.get('/', chartsController.getChartsTypes);

module.exports = router