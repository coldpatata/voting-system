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

// Fetch a specific Ballot along with its participants
const getBallotWithParticipants = async (req, res) => {
    try {
        const { ballot_id } = req.query; // Get ballot_id from the request parameters
        console.log(ballot_id)
        // Find the Ballot by its ID and include associated participants
        const ballot = await db.Ballot.findOne({
            where: { ballot_id },
            include: [
                {
                    model: db.Participants,
                    as: 'participants', // Alias defined in the relationship
                },
            ],
        });

        if (!ballot) {
            return res.status(404).json({
                message: `Ballot with ID ${ballot_id} not found.`,
            });
        }

        return res.status(200).json({
            message: 'Ballot retrieved successfully.',
            data: ballot,
        });
    } catch (error) {
        console.error('Error retrieving ballot with participants:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the ballot.' });
    }
};

module.exports = {
    createBallot,
    getBallotWithParticipants,
    getAllBallots,
};
