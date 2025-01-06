const express = require('express');
const router = express.Router();
const participantController = require('../controller/ParticipantsController');

router.get('/getAllParticipants', participantController.getAllParticipants);
router.post('/createParticipants', participantController.createParticipant);

module.exports = router;
