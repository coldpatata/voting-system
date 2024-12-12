const express = require('express');
const router = express.Router();
const ballotController = require('../controller/BallotController');

// User routes
router.get('/getAllBallot', ballotController.getAllBallots);
router.post('/createBallot', ballotController.createBallot);

module.exports = router;
