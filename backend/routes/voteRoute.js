const express = require('express');
const router = express.Router();
const voteController = require('../controller/VoteController');

router.post('/createVote', voteController.createVote);  // Changed from insertVote to createVote
router.get('/getVoteTally', voteController.getVoteTally);

module.exports = router;
