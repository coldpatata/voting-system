const db = require('../models/main');

// Insert a new candidate
const createCandidate = async (req, res) => {
    try {
        const { firstname, lastname, position, middle_initial, suffix, candidate_number, photo_url } = req.body;

        console.log(req.body);

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
            message: 'Candidate created successfully.',
            ballot_id: newCandidate.id,
            data: newCandidate,
        });
    } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ error: 'An error occurred while creating the candidate.' });
    }
};

// Retrieve all candidates
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await db.Candidates.findAll();

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

// Retrieve candidates by position
const getCandidatesByPosition = async (req, res) => {
    try {
        const { position } = req.query; // Get the 'position' from query parameters
        console.log(req.query)
        if (!position) {
            return res.status(400).json({ message: 'Position query parameter is required.' });
        }

        const candidates = await db.Candidates.findAll({
            where: { position }, // Sequelize WHERE clause
        });

        if (candidates.length === 0) {
            return res.status(404).json({ message: `No candidates found for position: ${position}` });
        }

        return res.status(200).json({
            message: `Candidates for position "${position}" retrieved successfully.`,
            data: candidates,
        });
    } catch (error) {
        console.error('Error retrieving candidates by position:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the candidates by position.' });
    }
};

// Update an existing candidate
const updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, position, middle_initial, suffix, candidate_number, photo_url } = req.body;

        const candidate = await db.Candidates.findByPk(id);

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found.' });
        }

        candidate.firstname = firstname;
        candidate.lastname = lastname;
        candidate.position = position;
        candidate.middle_initial = middle_initial;
        candidate.suffix = suffix;
        candidate.candidate_number = candidate_number;
        candidate.photo_url = photo_url;

        await candidate.save();

        return res.status(200).json({
            message: 'Candidate updated successfully.',
            data: candidate,
        });
    } catch (error) {
        console.error('Error updating candidate:', error);
        res.status(500).json({ error: 'An error occurred while updating the candidate.' });
    }
};

module.exports = {
    createCandidate,
    getAllCandidates,
    getCandidatesByPosition,
    updateCandidate, // Export the new method
};
