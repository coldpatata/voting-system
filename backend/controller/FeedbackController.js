const db = require('../models/main');
const { Feedbacks, Users } = db;

const createFeedback = async (req, res) => {
  try {
    const { user_id, subject, content } = req.body;
    console.log('Received feedback data:', { user_id, subject, content });

    if (!user_id || !subject || !content) {
      return res.status(400).json({ 
        message: 'User ID, Subject and Content are required.',
        received: { user_id, subject, content }
      });
    }

    // Create the feedback
    const newFeedback = await Feedbacks.create({
      user_id: Number(user_id),
      subject,
      content,
      status: 'pending'
    });

    return res.status(201).json({
      message: 'Feedback created successfully.',
      data: newFeedback,
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return res.status(500).json({ 
      message: 'Internal Server Error.',
      error: error.message,
      details: error.stack
    });
  }
};

const getAllFeedbacks = async (req, res) => {
  try {
    // Fetch all feedbacks along with user details
    const feedback = await Feedbacks.findAll({
      include: [
        {
          model: Users,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name'], // Fields to include
        },
      ],
    });

    if (feedback.length === 0) {
      return res.status(404).json({
        message: 'No feedbacks found.',
      });
    }

    return res.status(200).json({
      message: 'Feedbacks retrieved successfully.',
      data: feedback,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error retrieving feedback data.',
      error: error.message, // Include error for debugging (optional, remove in production)
    });
  }
};

const getUserFeedbacks = async (req, res) => {
  try {
    const { user_id } = req.params;

    const feedbacks = await Feedbacks.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']]  // Sort by newest first
    });

    if (feedbacks.length === 0) {
      return res.status(200).json({  // Changed from 404 to 200 to handle empty states better
        message: 'No feedbacks found for this user.',
        data: []
      });
    }

    return res.status(200).json({
      message: 'Feedbacks retrieved successfully.',
      data: feedbacks
    });
  } catch (error) {
    console.error('Error retrieving user feedbacks:', error);
    return res.status(500).json({
      message: 'Error retrieving feedback data.',
      error: error.message
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'in-progress', 'resolved', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value',
        validStatuses
      });
    }

    const feedback = await Feedbacks.findByPk(feedbackId);
    
    if (!feedback) {
      return res.status(404).json({
        message: 'Feedback not found'
      });
    }

    await feedback.update({ status });

    return res.status(200).json({
      message: 'Feedback status updated successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    return res.status(500).json({
      message: 'Failed to update feedback status',
      error: error.message
    });
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getUserFeedbacks,
  updateStatus
};
