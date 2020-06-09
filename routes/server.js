const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email');

//email route
router.post('/email', emailController.sendEmail);

module.exports = router