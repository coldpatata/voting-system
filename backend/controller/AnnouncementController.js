const db = require('../models/main');
const { Announcements } = db;

// Create a new announcement
const createAnnouncement = async (req, res) => {
    try {
        const { title_header, time_date, image_url, description_text } = req.body;

        // Validate required fields (image_url is optional)
        if (!title_header || !time_date || !description_text) {
            return res.status(400).json({ message: 'Title, date, and description are required.' });
        }

        // Create a new announcement
        const newAnnouncement = await Announcements.create({
            title_header,
            time_date,
            image_url: image_url || null, // Set to null if not provided
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

// Get active announcements
const getAnnouncements = async (req, res) => {
    try {
        const { page = 1, limit = 1 } = req.query; // Default: 1st page, 1 item per page
        const offset = (page - 1) * limit;

        const { count, rows: announcements } = await Announcements.findAndCountAll({
            where: { status: 'active' }, // Filter by status = "active"
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

// Get all announcements (active and archived)
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

// Update the status of an announcement
const updateStatus = async (req, res) => {
    try {
        const { announcement_id, status } = req.body;

        // Validate status input
        if (!status || (status !== 'active' && status !== 'archived')) {
            return res.status(400).json({ message: 'Status must be either "active" or "archived".' });
        }

        // Find the announcement
        const announcement = await Announcements.findByPk(announcement_id);

        // Check if the announcement exists
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found.' });
        }

        // Update the status
        announcement.status = status;
        await announcement.save();

        return res.status(200).json({
            message: 'Announcement status updated successfully.',
            data: announcement,
        });
    } catch (error) {
        console.error('Error updating announcement status:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    createAnnouncement,
    getAnnouncements,
    getAllAnnouncements,
    updateStatus,
};
