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
        const { ballot_id, user_id } = req.query; // Get ballot_id and user_id from the request parameters

        console.log(ballot_id)
        // Find the Ballot by its ID and include associated participants
        const ballot = await db.Ballot.findOne({
            where: { ballot_id },
            include: [
                {
                    model: db.Participants,
                    as: 'participants', // Alias defined in the relationship
                },
            ],
        });

        if (!ballot) {
            return res.status(404).json({
                message: `Ballot with ID ${ballot_id} not found.`,
            });
        }

        // Check opening date
        const currentDate = new Date();
        const openingDate = new Date(ballot.opening_date);
        if (currentDate < openingDate) {
            return res.status(403).json({
                message: 'Ballot is not open yet',
                openingDate: openingDate
            });
        }

        // Check if user has already submitted this ballot
        if (user_id) {
            const existingVote = await db.Votes.findOne({
                where: {
                    ballot_id,
                    user_id
                }
            });

            if (existingVote) {
                return res.status(403).json({
                    message: 'You have already submitted your vote for this ballot'
                });
            }

            // Check year level eligibility
            const user = await db.Users.findByPk(user_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const eligibleYearLevels = ballot.year_level_eligibility.split(',').map(level => level.trim());
            if (!eligibleYearLevels.includes(user.year_level) && ballot.year_level_eligibility !== 'all') {
                return res.status(403).json({
                    message: `You are not eligible to vote in this ballot. Eligible year levels: ${ballot.year_level_eligibility}`
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Ballot retrieved successfully.',
            data: ballot,
        });
    } catch (error) {
        console.error('Error retrieving ballot with participants:', error);
        res.status(500).json({ 
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
