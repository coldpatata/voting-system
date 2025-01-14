const db = require('../models/main');
const { Votes } = db;

const createVote = async (req, res) => {
  try {
    const { ballot_id, votes, user_id } = req.body;
    
    console.log('Received vote data:', { ballot_id, user_id, votes });

    // Input validation
    if (!ballot_id || !votes || !user_id) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields',
        received: { ballot_id, user_id, votes }
      });
    }

    // Validate all votes have candidate_ids
    if (!Array.isArray(votes) || votes.some(v => !v.candidate_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid votes format',
        received: votes
      });
    }

    // Check for existing vote
    const existingVote = await Votes.findOne({
      where: { 
        user_id: Number(user_id),
        ballot_id: Number(ballot_id)
      }
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted in this ballot'
      });
    }

    // Create votes
    const createdVotes = await Promise.all(
      votes.map(vote => 
        Votes.create({
          ballot_id: Number(ballot_id),
          candidate_id: Number(vote.candidate_id),
          user_id: Number(user_id)
        })
      )
    );

    return res.status(201).json({ 
      success: true,
      message: 'Votes successfully recorded.',
      data: createdVotes
    });
  } catch (error) {
    console.error('Error inserting vote:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to record votes',
      error: error.message
    });
  }
};

const insertVote = async (req, res) => {
  const { user_id, ballot_id, votes } = req.body;
  
  console.log('Received vote request:', { user_id, ballot_id, votes }); // Debug log

  // Validate required fields
  if (!user_id || !ballot_id || !votes || !Array.isArray(votes)) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: user_id, ballot_id, or votes',
      received: { user_id, ballot_id, votes }
    });
  }

  try {
    // Check if the user has already voted in this ballot
    const existingVote = await Votes.findOne({
      where: { 
        user_id: Number(user_id), 
        ballot_id: Number(ballot_id) 
      },
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted in this ballot.',
      });
    }

    // Create new votes
    const createdVotes = await Promise.all(
      votes.map(vote => 
        Votes.create({
          user_id: Number(user_id),
          ballot_id: Number(ballot_id),
          candidate_id: Number(vote.candidate_id),
        })
      )
    );

    return res.status(201).json({
      success: true,
      message: 'Vote successfully recorded.',
      data: createdVotes,
    });
  } catch (error) {
    console.error('Error inserting vote:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while recording your vote.',
      error: error.message,
      details: { user_id, ballot_id, votes }
    });
  }
};

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
