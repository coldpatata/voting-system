const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

// User routes
router.get('/', userController.getAllUsers);
router.get('/getUsersWithRoles', userController.getUsersWithRoles);
router.get('/searchUsers', userController.searchUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/updateUserStatus', userController.updateUserStatus);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
