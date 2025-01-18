const express = require('express');
const router = express.Router();
const announcementController = require('../controller/AnnouncementController');

router.get('/getAnnouncements', announcementController.getAnnouncements);
router.get('/getAllAnnouncements', announcementController.getAllAnnouncements);
router.post('/createAnnouncement', announcementController.createAnnouncement);
router.patch('/updateStatus', announcementController.updateStatus);
// Fix: Use announcementController instead of AnnouncementController
router.put('/update/:announcement_id', announcementController.updateAnnouncement);

module.exports = router;
