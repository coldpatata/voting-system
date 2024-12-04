const db = require('../models/main');
const { Announcements } = db;


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
        const { page = 1, limit = 1 } = req.query; // Default: 1st page, 1 item per page
        const offset = (page - 1) * limit;

        const { count, rows: announcements } = await Announcements.findAndCountAll({
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: [['time_date', 'DESC']], // Sort by date (newest first)
        });

        return res.status(200).json({
            message: 'Announcements retrieved successfully.',
            data: announcements,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page, 10),
            },
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
