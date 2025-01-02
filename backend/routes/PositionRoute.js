const express = require('express');
const router = express.Router();
const positionController = require('../controller/PositionController');

router.get('/getAllPositions', positionController.getAllPositions);
router.post('/createPosition', positionController.createPosition);

module.exports = router;
