const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/count', userController.countUsers);
router.get('/getStudentDetails', userController.getStudentDetails);
router.get('/getStaffDetails', userController.getStaffDetails);
router.get('/count/students', userController.countStudents);
router.get('/', userController.getAllUsers);
router.get('/getUsersWithRoles', userController.getUsersWithRoles);
router.get('/searchUsers', userController.searchUsers);
router.get('/searchUsersByRole', userController.getUsersByRoleName);
router.get('/searchWithRole', userController.searchUsersByRole);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/updateUserStatus', userController.updateUserStatus);
router.put('/updateUserDetails', userController.updateUserDetails);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/addStudent', userController.addStudent);
router.post('/addStaff', userController.addStaff);
router.post('/importStudents', upload.single('file'), userController.importStudents);



module.exports = router;
