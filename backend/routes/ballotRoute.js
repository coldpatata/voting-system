const express = require('express');
const router = express.Router();
const ballotController = require('../controller/BallotController');

router.get('/getAllBallots', ballotController.getAllBallots);
router.get('/getBallotWithParticipants', ballotController.getBallotWithParticipants);
router.post('/createBallot', ballotController.createBallot);

module.exports = router;
