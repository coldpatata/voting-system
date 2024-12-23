const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

// User routes
router.get('/', userController.getAllUsers);
router.get('/getUsersWithRoles', userController.getUsersWithRoles);
router.get('/searchUsers', userController.searchUsers);
router.get('/searchUsersByRole', userController.getUsersByRoleName);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/updateUserStatus', userController.updateUserStatus);
router.put('/updateUserDetails', userController.updateUserDetails);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
