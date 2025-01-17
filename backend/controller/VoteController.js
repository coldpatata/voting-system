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
  try {
    const { ballot_id } = req.query;
    console.log('Received ballot_id:', ballot_id);

    // Updated query to exclude archived candidates and positions
    const candidatesQuery = `
      SELECT 
        c.id,
        c.firstname,
        c.lastname,
        c.position,
        c.middle_initial,
        c.suffix,
        c.is_active,
        p.is_active as position_active,
        COUNT(v.vote_id) as vote_count
      FROM Candidates c
      LEFT JOIN Positions p ON c.position = p.position_name
      LEFT JOIN Votes v ON v.candidate_id = c.id AND v.ballot_id = :ballot_id
      WHERE c.is_active = true AND p.is_active = true
      GROUP BY 
        c.id,
        c.firstname,
        c.lastname,
        c.position,
        c.middle_initial,
        c.suffix,
        c.is_active,
        p.is_active
      ORDER BY c.position, vote_count DESC;
    `;

    // Updated voters query to handle reopened ballots
    const votersQuery = `
      SELECT 
        v.candidate_id,
        v.vote_id,
        v.created_at,
        u.first_name,
        u.last_name,
        u.year_level
      FROM Votes v
      JOIN Users u ON v.user_id = u.user_id
      JOIN Ballot b ON v.ballot_id = b.ballot_id
      WHERE v.ballot_id = :ballot_id
      AND (
        b.status != 'REOPENED' 
        OR v.created_at > b.reopened_date
      )
    `;

    const [candidates, voters] = await Promise.all([
      db.sequelize.query(candidatesQuery, {
        replacements: { ballot_id: Number(ballot_id) },
        type: db.sequelize.QueryTypes.SELECT,
        logging: console.log // Log the executed query
      }),
      db.sequelize.query(votersQuery, {
        replacements: { ballot_id: Number(ballot_id) },
        type: db.sequelize.QueryTypes.SELECT,
        logging: console.log // Log the executed query
      })
    ]);

    console.log('Candidates:', candidates);
    console.log('Voters:', voters);

    const tally = {};
    candidates.forEach(candidate => {
      const position = candidate.position;
      if (!tally[position]) {
        tally[position] = [];
      }
      
      const fullName = `${candidate.firstname} ${candidate.middle_initial ? candidate.middle_initial + '.' : ''} ${candidate.lastname} ${candidate.suffix || ''}`.trim();
      
      const candidateVoters = voters
        .filter(v => v.candidate_id === candidate.id)
        .map(v => ({
          student_name: `${v.first_name} ${v.last_name}`,
          year_level: v.year_level,
          vote_id: v.vote_id
        }));

      const positionTotalVotes = candidates
        .filter(c => c.position === position)
        .reduce((sum, c) => sum + Number(c.vote_count || 0), 0);

      const percentage = positionTotalVotes > 0 
        ? ((Number(candidate.vote_count || 0) / positionTotalVotes) * 100).toFixed(1)
        : '0.0';

      tally[position].push({
        candidate_id: candidate.id,
        participant_name: fullName,
        vote_count: Number(candidate.vote_count || 0),
        percentage,
        voters: candidateVoters
      });
    });

    console.log('Processed Tally:', tally);

    return res.status(200).json({
      success: true,
      message: 'Vote tally retrieved successfully.',
      data: tally
    });

  } catch (error) {
    console.error('Full error details:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while fetching the vote tally.',
      error: error.message,
      details: error.stack
    });
  }
};

const getTurnout = async (req, res) => {
  try {
    const { ballot_id } = req.query;

    if (!ballot_id) {
      return res.status(400).json({ message: 'Ballot ID is required.' });
    }

    // Enhanced query to get accurate turnout data
    const turnoutQuery = `
      WITH EligibleStudents AS (
        SELECT year_level, COUNT(*) as total_students
        FROM Users u
        JOIN Ballot b ON b.ballot_id = :ballot_id
        WHERE u.role_id = 3
        AND (
          b.year_level_eligibility = 'all'
          OR FIND_IN_SET(u.year_level, b.year_level_eligibility)
        )
        GROUP BY year_level
      ),
      VoteCounts AS (
        SELECT 
          u.year_level,
          COUNT(DISTINCT v.user_id) as votes_cast
        FROM Users u
        LEFT JOIN Votes v ON v.user_id = u.user_id 
        AND v.ballot_id = :ballot_id
        WHERE u.role_id = 3
        GROUP BY u.year_level
      )
      SELECT 
        e.year_level,
        e.total_students,
        COALESCE(v.votes_cast, 0) as votes_cast,
        ROUND((COALESCE(v.votes_cast, 0) * 100.0 / e.total_students), 1) as turnout_percentage
      FROM EligibleStudents e
      LEFT JOIN VoteCounts v ON e.year_level = v.year_level
      ORDER BY e.year_level;
    `;

    const turnoutResults = await db.sequelize.query(turnoutQuery, {
      replacements: { ballot_id: Number(ballot_id) },
      type: db.sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({
      success: true,
      message: 'Turnout data retrieved successfully.',
      data: turnoutResults
    });

  } catch (error) {
    console.error('Error fetching turnout data:', error);
    return res.status(500).json({ 
      success: false,
      error: 'An error occurred while fetching the turnout data.',
      details: error.message 
    });
  }
};

module.exports = {
  createVote,
  getVoteTally,
  insertVote,
  getTurnout
};
