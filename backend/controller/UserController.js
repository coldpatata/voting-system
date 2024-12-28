const db = require('../models/main'); // Adjust the path based on your structure
const { Users, UserRoles } = db;
const { Op } = require('sequelize');
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      include: [{ model: UserRoles, as: 'role' }]
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id, {
      include: [{ model: UserRoles, as: 'role' }]
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = await Users.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Update an existing user
exports.updateUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};


exports.updateUserDetails = async (req, res) => {
  try {
    const { user_id } = req.query; // Accessing from URL parameter
    const {
      username,
      email,
      first_name,
      middle_initial,
      last_name,
      year_level,
      role_id,
      section,
      contact_number,
      status,
    } = req.body;

    // Find the user by ID
    const user = await Users.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user fields
    await user.update({
      username,
      email,
      first_name,
      middle_initial,
      last_name,
      year_level,
      role_id,
      section,
      contact_number,
      status,
    });

    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      message: 'An error occurred while updating the user',
      error: error.message,
    });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Fetch user details with role_name
exports.getUsersWithRoles = async (req, res) => {
  try {
    // Get page and limit from query parameters (default to page 1, limit 5)
    const { page = 1, limit = 5 } = req.query;

    // Calculate offset and limit
    const offset = (page - 1) * limit;

    // Fetch paginated data
    const { rows: users, count: totalUsers } = await Users.findAndCountAll({
      attributes: ['user_id', 'username', 'email', 'status'], // Columns from Users
      include: [
        {
          model: UserRoles,
          as: 'role', // This should match the alias in the association
          attributes: ['role_name'], // Column from UserRoles
        },
      ],
      limit: parseInt(limit, 10), // Limit number of results per page
      offset: parseInt(offset, 10), // Skip results for previous pages
    });

    // Total pages
    const totalPages = Math.ceil(totalUsers / limit);

    // Send paginated response
    res.status(200).json({
      currentPage: parseInt(page, 10),
      totalPages,
      totalUsers,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users with roles:", error);
    res.status(500).json({ error: 'Failed to fetch users with roles' });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { username = '', page = 1, limit = 5 } = req.query;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Fetch matching users with the specified username
    const { rows: users, count: totalUsers } = await Users.findAndCountAll({
      where: {
        username: {
          [Op.like]: `%${username}%`, // Use a LIKE query for partial matches
        },
      },
      attributes: ['username', 'email', 'status'],
      include: [{
        model: UserRoles,
        as: 'role',
        attributes: ['role_name'],
      }],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalUsers / limit);

    // Respond with the filtered users, pagination details
    res.status(200).json({
      currentPage: parseInt(page, 10),
      totalPages,
      totalUsers,
      data: users,
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'An error occurred while searching for users.' });
  }
};

// Controller function to update user status
exports.updateUserStatus = async (req, res) => {
  const { user_id, status } = req.body;

  try {
    // Validate the status input
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'ACTIVE' or 'INACTIVE'." });
    }

    // Check if user_id exists
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find the user by user_id
    const user = await Users.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the user's status
    user.status = status;
    await user.save();

    // Send success response
    return res.status(200).json({
      message: `User status updated to ${status}`,
      user: { user_id: user.user_id, status: user.status },
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

exports.getUsersByRoleName = async (req, res) => {
  const { role_name } = req.query;

  if (!role_name) {
    return res.status(400).json({ error: 'role_name query parameter is required' });
  }

  try {
    // Find users with the given role_name
    const users = await Users.findAll({
      include: [
        {
          model: UserRoles,
          as: 'role',
          attributes: ['role_name'], // Only include the role_name attribute
          where: { role_name }, // Filter by the role_name
        },
      ],
      attributes: { exclude: ['password'] }, // Exclude sensitive data like password
    });

    // Check if any users are found
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found with the specified role' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};


exports.countUsers = async (req, res) => {
  try {
    const totalUsers = await Users.count(); 
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({ message: 'An error occurred while counting users', error });
  }
};

exports.countStudents = async (req, res) => {
  try {
    const studentCount = await Users.count({ where: { role_id: 1 } }); // Filter by role_id for 'student'
    res.status(200).json({ totalStudents: studentCount });
  } catch (error) {
    console.error('Error counting students:', error);
    res.status(500).json({ message: 'An error occurred while counting students', error });
  }
};
