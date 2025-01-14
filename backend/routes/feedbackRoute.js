const express = require('express');
const router = express.Router();
const feedbackController = require('../controller/FeedbackController');

router.get('/getAllFeedbacks', feedbackController.getAllFeedbacks);
router.post('/createFeedback', feedbackController.createFeedback);
router.get('/user/:user_id', feedbackController.getUserFeedbacks);  // Updated to use getUserFeedbacks
router.put('/updateStatus/:feedbackId', feedbackController.updateStatus);

module.exports = router;