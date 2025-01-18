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
            image_url: image_url || null, 
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
        const { page = 1, limit = 1 } = req.query;
        const pageInt = Math.max(1, parseInt(page, 10)); // Ensure page is at least 1
        const limitInt = parseInt(limit, 10);
        const offset = (pageInt - 1) * limitInt;

        // Use a single query with subquery for better performance
        const [[{ total }], announcements] = await Promise.all([
            Announcements.sequelize.query(
                'SELECT COUNT(*) as total FROM announcements WHERE status = :status',
                {
                    replacements: { status: 'active' },
                    type: Announcements.sequelize.QueryTypes.SELECT
                }
            ),
            Announcements.findAll({
                where: { status: 'active' },
                limit: limitInt,
                offset: offset,
                order: [['time_date', 'DESC']],
                raw: true // For better performance
            })
        ]);

        const totalPages = Math.ceil(total / limitInt);

        return res.status(200).json({
            success: true,
            message: 'Announcements retrieved successfully.',
            data: announcements,
            pagination: {
                totalItems: total,
                totalPages,
                currentPage: pageInt,
                itemsPerPage: limitInt,
                hasNextPage: pageInt < totalPages,
                hasPreviousPage: pageInt > 1
            }
        });
    } catch (error) {
        console.error('Error retrieving announcements:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving announcements',
            error: error.message
        });
    }
};

// Get all announcements (active and archived)
const getAllAnnouncements = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        const offset = (pageInt - 1) * limitInt;

        const where = {};
        if (status) {
            where.status = status;
        }

        // Get total count first
        const totalCount = await Announcements.count({ where });

        // Then get paginated data
        const announcements = await Announcements.findAll({
            where,
            limit: limitInt,
            offset: offset,
            order: [['time_date', 'DESC']],
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limitInt);

        return res.status(200).json({
            message: 'Announcements retrieved successfully.',
            data: announcements,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: pageInt,
                itemsPerPage: limitInt,
                hasNextPage: pageInt < totalPages,
                hasPreviousPage: pageInt > 1
            }
        });
    } catch (error) {
        console.error('Error retrieving announcements:', error);
        return res.status(500).json({ 
            message: 'Internal server error.',
            error: error.message 
        });
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

const updateAnnouncement = async (req, res) => {
    try {
        const { announcement_id } = req.params;
        const { title_header, description_text, image_url } = req.body;

        const announcement = await Announcements.findByPk(announcement_id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found.' });
        }

        await announcement.update({
            title_header,
            description_text,
            image_url,
            time_date: new Date() // Update timestamp
        });

        return res.status(200).json({
            message: 'Announcement updated successfully.',
            data: announcement
        });
    } catch (error) {
        console.error('Error updating announcement:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    createAnnouncement,
    getAnnouncements,
    getAllAnnouncements,
    updateStatus,
    updateAnnouncement
};
