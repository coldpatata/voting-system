const express = require("express");
const router = express.Router();
const AuthController = require('../controller/AuthenticationController');

router.post("/Register", AuthController.Register);
router.post("/Login", AuthController.Login);
router.post("/ResetPassword", AuthController.ResetPassword);
router.put("/ChangePassword", AuthController.changePassword);





module.exports = router;

