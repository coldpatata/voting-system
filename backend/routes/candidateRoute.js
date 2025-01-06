const express = require('express');
const router = express.Router();
const candidateController = require('../controller/CandidateController');

router.get('/getAllCandidates', candidateController.getAllCandidates);
router.get('/getCandidatesByPosition', candidateController.getCandidatesByPosition);
router.post('/createCandidate', candidateController.createCandidate);

module.exports = router;
