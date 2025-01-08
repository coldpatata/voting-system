const db = require('../models/main');


const createVote = async (req, res) => {
    try {
        const { ballot_id, candidate_id, user_id } = req.body;

        console.log("VOTE REQ BODY")
        console.log(req.body);

        const newVote = await db.Votes.create({
            ballot_id,
            candidate_id,
            user_id
        });

        return res.status(201).json({
            message: 'vote inserted successfully.',
            vote_id: newVote.vote_id,
            data: newVote,
        });
    } catch (error) {
        console.error('Error inserting vote:', error);
        res.status(500).json({ error: 'An error occurred while inserting the vote.' });
    }
};

module.exports = {
    createVote
};
