const express = require('express');
const router = express.Router();
const candidateController = require('../controller/CandidateController');

router.get('/getAllCandidates', candidateController.getAllCandidates);
router.get('/getCandidatesByPosition', candidateController.getCandidatesByPosition);
router.post('/createCandidate', candidateController.createCandidate);
router.put('/updateCandidate/:id', candidateController.updateCandidate); // New route for updating a candidate

module.exports = router;
