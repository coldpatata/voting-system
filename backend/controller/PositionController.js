const db = require('../models/main'); 

// Insert a new positon
const createPosition = async (req, res) => {
    try {
        const { position_name, max_vote_count} = req.body;

        console.log(req.body)

        if (!position_name || !max_vote_count) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newPosition = await db.Positions.create({
            position_name,
            max_vote_count
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
        const positions = await db.Positions.findAll(); // Adjust the query if using Sequelize or raw SQL

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

module.exports = {
    createPosition,
    getAllPositions,
};
