const express = require('express');
const router = express.Router();
const voteController = require('../controller/VoteController');

router.post('/insertVote', voteController.createVote);

module.exports = router;
