const express = require('express');
const router = express.Router();
const positionController = require('../controller/PositionController');

// Routes
router.get('/getAllPositions', positionController.getAllPositions);
router.post('/createPosition', positionController.createPosition);
router.put('/updatePosition/:id', positionController.updatePosition); // Route for updating a position
router.put('/positions/:id/archive', positionController.archivePosition); // Fixed naming

module.exports = router;
