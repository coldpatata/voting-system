const express = require('express');
const router = express.Router();
const ballotController = require('../controller/BallotController');

router.get('/getAllBallots', ballotController.getAllBallots);
router.post('/createBallot', ballotController.createBallot);

module.exports = router;
