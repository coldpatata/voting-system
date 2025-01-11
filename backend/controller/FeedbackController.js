const db = require('../models/main');
const { Feedbacks, Users } = db;

const createFeedback = async (req, res) => {
    try {
      const user_id = req.cookies.uid;
  
      if (!user_id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      const { subject, content } = req.body;
  
      const user = await Users.findOne({
        where: { user_id, role_id: 1 },
      });
  
      if (!user) {
        return res.status(403).json({ message: 'Only students can create feedback.' });
      }
  
      if (!subject || !content) {
        return res.status(400).json({ message: 'Subject and Content are required.' });
      }
  
      const newFeedback = await Feedbacks.create({ user_id, subject, content });
  
      return res.status(201).json({
        message: 'Feedback created successfully.',
        data: newFeedback,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error.' });
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
    const { user_id } = req.params; // Get the user_id from the request parameters

    // Verify that the user exists
    const user = await Users.findOne({ where: { user_id } });
    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    // Fetch feedbacks created by the specific user
    const feedback = await Feedbacks.findAll({
      where: {
        user_id,
      },
    });

    if (feedback.length === 0) {
      return res.status(404).json({
        message: 'No feedbacks found for this user.',
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

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getUserFeedbacks,
};
