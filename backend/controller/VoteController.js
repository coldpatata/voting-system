const db = require('../models/main');

const createVote = async (req, res) => {
    try {
        const { ballot_id, candidate_id, user_id } = req.body;

        console.log("VOTE REQ BODY");
        console.log(req.body);

        const newVote = await db.Votes.create({
            ballot_id,
            candidate_id,
            user_id
        });

        return res.status(201).json({
            message: 'Vote inserted successfully.',
            vote_id: newVote.vote_id,
            data: newVote,
        });
    } catch (error) {
        console.error('Error inserting vote:', error);
        res.status(500).json({ error: 'An error occurred while inserting the vote.' });
    }
};

// New getVoteTally function
const getVoteTally = async (req, res) => {
    try {
        const { ballot_id } = req.query;

        if (!ballot_id) {
            return res.status(400).json({ error: 'Ballot ID is required.' });
        }

        // Fetch vote counts grouped by candidate and position
        const voteTally = await db.Votes.findAll({
            where: { ballot_id },
            attributes: [
                'candidate_id',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('candidate_id')), 'vote_count'],
            ],
            include: [
                {
                    model: db.Participants, // Adjust this to match your model name for participants
                    attributes: ['participant_name', 'position'],
                },
            ],
            group: ['candidate_id', 'Participants.participant_id', 'Participants.position'],
        });

        const formattedTally = voteTally.map((vote) => ({
            position: vote.Participants.position,
            candidate_id: vote.candidate_id,
            participant_name: vote.Participants.participant_name,
            vote_count: parseInt(vote.dataValues.vote_count, 10),
        }));

        return res.status(200).json({
            success: true,
            data: formattedTally,
        });
    } catch (error) {
        console.error('Error fetching vote tally:', error);
        res.status(500).json({ error: 'An error occurred while fetching the vote tally.' });
    }
};

module.exports = {
    createVote,
    getVoteTally,
};
