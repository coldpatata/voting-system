const express = require('express');
const router = express.Router();
const announcementController = require('../controller/AnnouncementController');

// User routes
router.get('/getAnnouncements', announcementController.getAnnouncements);
router.get('/getAllAnnouncements', announcementController.getAllAnnouncements);
router.post('/createAnnouncement', announcementController.createAnnouncement);
router.patch('/updateStatus', announcementController.updateStatus);

module.exports = router;
