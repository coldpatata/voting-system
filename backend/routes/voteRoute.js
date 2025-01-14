const express = require('express');
const router = express.Router();
const voteController = require('../controller/VoteController');

router.post('/createVote', voteController.createVote); 
router.get('/getVoteTally', voteController.getVoteTally); // New route for fetching the vote tally
router.get('/getTurnout', voteController.getTurnout); // Ensure this route is defined

module.exports = router;
