const db = require('../models/main'); // Adjust the path based on your project structure

// Insert a new Participant
const createParticipant = async (req, res) => {
    try {
        const { ballot_id, participant_name, position, photo_url } = req.body;

        console.log(req.body);

        // Create a new Participant
        const newParticipant = await db.Participants.create({
            ballot_id,
            participant_name,
            position,
            photo_url
        });

        return res.status(201).json({
            message: 'Participant created successfully.',
            participant_id: newParticipant.participant_id,
            data: newParticipant,
        });
    } catch (error) {
        console.error('Error creating participant:', error);
        res.status(500).json({ error: 'An error occurred while creating the participant.' });
    }
};

// Retrieve all Participants
const getAllParticipants = async (req, res) => {
    try {
        const participants = await db.Participants.findAll({
            include: {
                model: db.Ballot,
                as: 'ballot',
            },
        }); // Fetch all Participants with their associated Ballot

        if (participants.length === 0) {
            return res.status(404).json({ message: 'No participants found.' });
        }

        return res.status(200).json({
            message: 'Participants retrieved successfully.',
            data: participants,
        });
    } catch (error) {
        console.error('Error retrieving participants:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the participants.' });
    }
};

module.exports = {
    createParticipant,
    getAllParticipants,
};
