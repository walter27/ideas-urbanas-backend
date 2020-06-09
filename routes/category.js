const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

// Routes of users
router.get('/', categoryController.getCategoryTypes);

module.exports = router