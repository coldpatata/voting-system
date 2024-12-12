const express = require('express');
const router = express.Router();
const candidateController = require('../controller/CandidateController');

// User routes
router.post('/createCandidate', candidateController.createCandidate);

module.exports = router;
