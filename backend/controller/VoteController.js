const db = require('../models/main');
const {Participants, Votes} = db;
const { Sequelize } = require('sequelize');


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


// Example in your VoteController.js
const insertVote = async (req, res) => {
    const { user_id, ballot_id, candidate_id } = req.body;
  
    try {
      // Check if the user has already voted in this ballot
      const existingVote = await Votes.findOne({
        where: { user_id, ballot_id },
      });
  
      if (existingVote) {
        return res.status(400).json({
          success: false,
          message: 'You have already voted in this ballot.',
        });
      }
  
      // Create a new vote
      await Votes.create({ user_id, ballot_id, candidate_id });
  
      return res.status(201).json({
        success: true,
        message: 'Vote successfully recorded.',
      });
    } catch (error) {
      console.error('Error inserting vote:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while recording your vote.',
      });
    }
  };
  
// New getVoteTally function
// Example in your VoteController.js
const getVoteTally = async (req, res) => {
    const { ballot_id } = req.query;
  
    try {
      const voteTally = await Participants.findAll({
        where: { ballot_id },
        include: [
          {
            model: Votes,
            as: 'votes',
            attributes: [[Sequelize.fn('COUNT', Sequelize.col('votes.id')), 'voteCount']],
          },
        ],
        group: ['Participants.participant_id'],
        attributes: ['participant_id', 'participant_name', 'position'],
      });
  
      res.status(200).json({
        success: true,
        data: voteTally,
      });
    } catch (error) {
      console.error('Error fetching vote tally:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching vote tally.',
      });
    }
  };
  


module.exports = {
    createVote,
    getVoteTally,
    insertVote
};
