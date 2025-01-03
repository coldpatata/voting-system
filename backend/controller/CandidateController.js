const db = require('../models/main'); 

// Insert a new positon
const createCandidate = async (req, res) => {
    try {
        const { firstname, lastname, position, middle_initial, suffix, candidate_number, photo_url} = req.body;

        console.log(req.body)

        const newCandidate = await db.Candidates.create({
            firstname,
            lastname,
            position,
            middle_initial,
            suffix,
            candidate_number,
            photo_url,
        });

        return res.status(201).json({
            message: 'candidate created successfully.',
            ballot_id: newCandidate.id,
            data: newCandidate,
        });
    } catch (error) {
        console.error('Error creating position:', error);
        res.status(500).json({ error: 'An error occurred while creating the position.' });
    }
};

// Retrieve all positon
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await db.Candidates.findAll(); // Adjust the query if using Sequelize or raw SQL

        if (candidates.length === 0) {
            return res.status(404).json({ message: 'No candidates found.' });
        }

        return res.status(200).json({
            message: 'Candidates retrieved successfully.',
            data: candidates,
        });
    } catch (error) {
        console.error('Error retrieving candidates:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the candidates.' });
    }
};

module.exports = {
    createCandidate,
    getAllCandidates,
};
