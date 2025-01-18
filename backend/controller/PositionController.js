const db = require('../models/main'); 

// Insert a new positon
const createPosition = async (req, res) => {
    try {
        const { position_name} = req.body;

        console.log(req.body)

        if (!position_name ) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newPosition = await db.Positions.create({
            position_name
       
        });

        return res.status(201).json({
            message: 'Position created successfully.',
            ballot_id: newPosition.position_id,
            data: newPosition,
        });
    } catch (error) {
        console.error('Error creating position:', error);
        res.status(500).json({ error: 'An error occurred while creating the position.' });
    }
};

// Retrieve all positon
const getAllPositions = async (req, res) => {
    try {
        const { includeArchived = false } = req.query;
        let where = {};
        
        // Check if is_active column exists before adding it to where clause
        try {
            await db.Positions.describe();
            where = includeArchived ? {} : { is_active: true };
        } catch (error) {
            console.warn('is_active column might not exist yet');
        }
        
        const positions = await db.Positions.findAll({ where });

        if (positions.length === 0) {
            return res.status(404).json({ message: 'No positions found.' });
        }

        return res.status(200).json({
            message: 'Positions retrieved successfully.',
            data: positions,
        });
    } catch (error) {
        console.error('Error retrieving positions:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the positions.' });
    }
};

// Update an existing position
const updatePosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { position_name} = req.body;

        const position = await db.Positions.findByPk(id);

        if (!position) {
            return res.status(404).json({ message: 'Position not found.' });
        }

        position.position_name = position_name;
   
        await position.save();

        return res.status(200).json({
            message: 'Position updated successfully.',
            data: position,
        });
    } catch (error) {
        console.error('Error updating position:', error);
        res.status(500).json({ error: 'An error occurred while updating the position.' });
    }
};

const archivePosition = async (req, res) => {
    try {
        const { id } = req.params;
        const position = await db.Positions.findByPk(id);
        
        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }

        await position.update({
            is_active: false,
            archived_at: new Date()
        });

        return res.status(200).json({
            success: true,
            message: 'Position archived successfully'
        });
    } catch (error) {
        console.error('Error archiving position:', error);
        return res.status(500).json({ error: 'Failed to archive position' });
    }
};

module.exports = {
    createPosition,
    getAllPositions,
    updatePosition, // Export the new method
    archivePosition
};
