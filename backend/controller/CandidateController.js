const db = require('../models/main'); // Adjust the path based on your structure

// Insert a new candidate
const createCandidate = async (req, res) => {
    try {
        const { ballot_id, candidate_name } = req.body;

        if (!ballot_id || !candidate_name) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if the ballot exists
        const ballot = await db.Ballots.findByPk(ballot_id);
        if (!ballot) {
            return res.status(404).json({ error: 'Ballot not found.' });
        }

        const newCandidate = await db.Candidates.create({
            ballot_id,
            candidate_name,
        });

        return res.status(201).json({
            message: 'Candidate created successfully.',
            data: newCandidate,
        });
    } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ error: 'An error occurred while creating the candidate.' });
    }
};

module.exports = {
    createCandidate,
};
