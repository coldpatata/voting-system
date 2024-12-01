const express = require('express');
const router = express.Router();
const announcementController = require('../controller/AnnouncementController');

// User routes
router.get('/getAnnouncements', announcementController.getAllAnnouncements);
router.post('/createAnnouncement', announcementController.createAnnouncement);

module.exports = router;
