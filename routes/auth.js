const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/forceChangePassword', authController.forceChangePassword);

module.exports = router