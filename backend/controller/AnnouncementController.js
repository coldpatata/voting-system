const db = require('../models/main');
const { Announcements }= db;


const createAnnouncement = async (req, res) => {
    try {
        const { title_header, time_date, image_url, description_text } = req.body;

        // Validate required fields
        if (!title_header || !time_date || !image_url || !description_text) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create a new announcement
        const newAnnouncement = await Announcements.create({
            title_header,
            time_date,
            image_url,
            description_text,
        });

        return res.status(201).json({
            message: 'Announcement created successfully.',
            data: newAnnouncement,
        });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcements.findAll();

        return res.status(200).json({
            message: 'Announcements retrieved successfully.',
            data: announcements,
        });
    } catch (error) {
        console.error('Error retrieving announcements:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
};
