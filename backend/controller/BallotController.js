const db = require('../models/main'); // Adjust the path based on your project structure

// Insert a new Ballot
const createBallot = async (req, res) => {
    try {
        const { ballot_name, opening_date, closing_date, year_level_eligibility, status } = req.body;

        console.log(req.body);

        // Create a new Ballot
        const newBallot = await db.Ballot.create({
            ballot_name,
            opening_date,
            closing_date,
            year_level_eligibility,
            status,
        });

        return res.status(201).json({
            message: 'Ballot created successfully.',
            ballot_id: newBallot.ballot_id,
            data: newBallot,
        });
    } catch (error) {
        console.error('Error creating ballot:', error);
        res.status(500).json({ error: 'An error occurred while creating the ballot.' });
    }
};

// Retrieve all Ballots
const getAllBallots = async (req, res) => {
    try {
        const ballots = await db.Ballot.findAll(); // Fetch all Ballots

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
