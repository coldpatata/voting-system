const express = require('express');
const router = express.Router();
const voteController = require('../controller/VoteController');

router.post('/insertVote', voteController.createVote);
router.get('/getVoteTally', voteController.getVoteTally);

module.exports = router;
