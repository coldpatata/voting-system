const express = require('express');
const router = express.Router();
const candidateController = require('../controller/CandidateController');

// Routes
router.get('/getAllCandidates', candidateController.getAllCandidates);
router.get('/getCandidatesByPosition', candidateController.getCandidatesByPosition);
router.post('/createCandidate', candidateController.createCandidate);
router.put('/updateCandidate/:id', candidateController.updateCandidate); // Route for updating a candidate
router.put('/candidates/:id/archive', candidateController.archiveCandidate); // Fixed naming

module.exports = router;
