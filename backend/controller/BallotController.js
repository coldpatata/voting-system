const db = require('../models/main'); // Adjust the path based on your project structure

// Insert a new Ballot
const createBallot = async (req, res) => {
    try {
        const { ballot_name, opening_date, closing_date, year_level_eligibility, status } = req.body;

        console.log(req.body);

        // Validate year level eligibility format
        const validGrades = ['all', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
        if (year_level_eligibility !== 'all') {
            const grades = year_level_eligibility.split(',').map(g => g.trim());
            const allValid = grades.every(grade => validGrades.includes(grade));
            if (!allValid) {
                return res.status(400).json({
                    message: 'Invalid grade level format',
                    validGrades,
                    received: grades
                });
            }
        }

        // Create a new Ballot
        const newBallot = await db.Ballot.create({
            ballot_name,
            opening_date,
            closing_date,
            year_level_eligibility: year_level_eligibility === 'all' 
                ? 'all' 
                : year_level_eligibility.split(',').map(g => g.trim()).join(','),
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
    const { ballot_id, user_id } = req.query;
    
    const ballot = await db.Ballot.findOne({
      where: { ballot_id },
      include: [{
        model: db.Participants,
        as: 'participants',
      }]
    });

    if (!ballot) {
      return res.status(404).json({
        success: false,
        message: 'Ballot not found'
      });
    }

    // Check user eligibility first before any other checks
    if (user_id) {
      const user = await db.Users.findByPk(user_id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check year level eligibility
      const eligibleYearLevels = ballot.year_level_eligibility === 'all' 
        ? ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10']
        : ballot.year_level_eligibility.split(',').map(level => level.trim());

      if (!eligibleYearLevels.includes(user.year_level) && ballot.year_level_eligibility !== 'all') {
        return res.status(403).json({
          success: false,
          message: `You are not eligible to vote in this ballot. This ballot is only for: ${ballot.year_level_eligibility}. Your year level is ${user.year_level}`
        });
      }

      // Check if already voted
      const existingVote = await db.Votes.findOne({
        where: { ballot_id, user_id }
      });

      if (existingVote) {
        return res.status(200).json({
          success: false,
          message: 'You have already submitted your vote',
          data: {
            ballot_name: ballot.ballot_name,
            submission_date: existingVote.createdAt,
            status: 'submitted'
          }
        });
      }
    }

    // Check dates
    const now = new Date();
    const openingDate = new Date(ballot.opening_date);
    const closingDate = new Date(ballot.closing_date);

    if (now < openingDate) {
      return res.status(403).json({
        success: false,
        message: `This ballot will open on ${openingDate.toLocaleString()}`,
        openingDate
      });
    }

    if (now > closingDate) {
      await ballot.update({ status: 'CLOSED' });
      return res.status(403).json({
        success: false,
        message: 'This ballot is already closed',
        closingDate
      });
    }

    // If all checks pass, return ballot data
    return res.status(200).json({
      success: true,
      data: {
        ...ballot.toJSON(),
        hasVoted: false
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve ballot',
      error: error.message
    });
  }
};

// Fetch a specific Ballot by its ID
const getBallot = async (req, res) => {
    try {
        const { id } = req.params;
        
        const ballot = await db.Ballot.findByPk(id);

        if (!ballot) {
            return res.status(404).json({
                success: false,
                message: `Ballot with ID ${id} not found.`
            });
        }

        // Generate QR code if it doesn't exist
        if (!ballot.qr_code) {
            const qrData = {
                ballot_id: ballot.ballot_id,
                name: ballot.ballot_name,
                url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/student/ballot/${ballot.ballot_id}`
            };
            ballot.qr_code = await QRCode.toDataURL(JSON.stringify(qrData));
            await ballot.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Ballot retrieved successfully.',
            data: ballot
        });
    } catch (error) {
        console.error('Error retrieving ballot:', error);
        res.status(500).json({ 
            success: false,
            error: 'An error occurred while retrieving the ballot.'
        });
    }
};

const updateBallot = async (req, res) => {
    try {
        const { id } = req.params;
        const { ballot_name, opening_date, closing_date, year_level_eligibility } = req.body;

        // Validate year level eligibility format
        const validGrades = ['all', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
        if (year_level_eligibility !== 'all') {
            const grades = year_level_eligibility.split(',').map(g => g.trim());
            const allValid = grades.every(grade => validGrades.includes(grade));
            if (!allValid) {
                return res.status(400).json({
                    message: 'Invalid grade level format',
                    validGrades,
                    received: grades
                });
            }
        }

        const ballot = await db.Ballot.findByPk(id);
        
        if (!ballot) {
            return res.status(404).json({
                success: false,
                message: `Ballot with ID ${id} not found.`
            });
        }

        await ballot.update({
            ballot_name,
            opening_date,
            closing_date,
            year_level_eligibility: year_level_eligibility === 'all' 
                ? 'all' 
                : year_level_eligibility.split(',').map(g => g.trim()).join(',')
        });

        return res.status(200).json({
            success: true,
            message: 'Ballot updated successfully.',
            data: ballot
        });
    } catch (error) {
        console.error('Error updating ballot:', error);
        res.status(500).json({ 
            success: false,
            error: 'An error occurred while updating the ballot.'
        });
    }
};

module.exports = {
    createBallot,
    getBallotWithParticipants,
    getAllBallots,
    getBallot,
    updateBallot,
};
