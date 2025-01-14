const express = require('express');
const router = express.Router();
const positionController = require('../controller/PositionController');

router.get('/getAllPositions', positionController.getAllPositions);
router.post('/createPosition', positionController.createPosition);
router.put('/updatePosition/:id', positionController.updatePosition); // New route for updating a position

module.exports = router;
