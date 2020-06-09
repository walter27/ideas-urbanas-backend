const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Routes of users
router.get('/:id?', userController.getUsers);
router.post('/', userController.addUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/update_password/:id', userController.updatePassword);

module.exports = router