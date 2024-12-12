const db = require('../models/main'); // Adjust the path based on your structure

// Insert a new ballot
const createBallot = async (req, res) => {
    try {
        const { ballot_name, opening_date, closing_date, year_level_eligibility } = req.body;

        if (!ballot_name || !opening_date || !closing_date || !year_level_eligibility) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newBallot = await db.Ballots.create({
            ballot_name,
            opening_date: new Date(opening_date),
            closing_date: new Date(closing_date),
            year_level_eligibility,
        });

        return res.status(201).json({
            message: 'Ballot created successfully.',
            ballot_id: newBallot.ballot_id, // Include the insertID in the response
            data: newBallot,
        });
    } catch (error) {
        console.error('Error creating ballot:', error);
        res.status(500).json({ error: 'An error occurred while creating the ballot.' });
    }
};

// Retrieve all ballots
const getAllBallots = async (req, res) => {
    try {
        const ballots = await db.Ballots.findAll(); // Adjust the query if using Sequelize or raw SQL

        if (ballots.length === 0) {
            return res.status(404).json({ message: 'No ballots found.' });
        }

        return res.status(200).json({
            message: 'Ballots retrieved successfully.',
            data: ballots,
        });
    } catch (error) {
        console.error('Error retrieving ballots:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the ballots.' });
    }
};

module.exports = {
    createBallot,
    getAllBallots,
};
