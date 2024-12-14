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
      attributes: ['username', 'email', 'status'], // Columns from Users
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

