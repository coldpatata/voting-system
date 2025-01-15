const express = require('express');
const router = express.Router();
const ballotController = require('../controller/BallotController');

router.get('/getAllBallots', ballotController.getAllBallots);
router.get('/getBallotWithParticipants', ballotController.getBallotWithParticipants);
router.post('/createBallot', ballotController.createBallot);
router.get('/getBallot/:id', ballotController.getBallot);
router.put('/updateBallot/:id', ballotController.updateBallot);

module.exports = router;
