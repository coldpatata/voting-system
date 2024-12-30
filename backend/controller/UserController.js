const db = require('../models/main'); // Adjust the path based on your structure
const { Users, UserRoles } = db;
const { Op } = require('sequelize');
const path = require('path');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt');
const fs = require('fs');

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
    const { page = 1, limit = 10 } = req.query;

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
      attributes: ['user_id', 'username', 'email', 'status'],
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
    // Validate the input
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    if (!['active', 'inactive'].includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status. Use 'active' or 'inactive'." });
    }

    // Find the user by user_id
    const user = await Users.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the user's status
    user.status = status.toLowerCase(); // Normalize status to lowercase
    await user.save();

    // Send success response
    return res.status(200).json({
      message: `User status updated successfully.`,
      user: {
        user_id: user.user_id,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Error updating user status:', error);

    // Handle Sequelize-specific errors or generic errors
    return res.status(500).json({
      message: 'An error occurred while updating the user status.',
      error: error.message,
    });
  }
};


exports.getUsersByRoleName = async (req, res) => {
  const { role_name, page = 1, limit = 10 } = req.query;

  if (!role_name) {
    return res.status(400).json({ error: 'role_name query parameter is required' });
  }

  const offset = (page - 1) * limit;

  try {
    const { count, rows: users } = await Users.findAndCountAll({
      include: [
        {
          model: UserRoles,
          as: 'role',
          attributes: ['role_name'],
          where: { role_name },
        },
      ],
      attributes: { exclude: ['password'] },
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      data: users,
      meta: {
        total: count,
        page: parseInt(page, 10),
        totalPages,
      },
    });
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

exports.getStudentDetails = async (req, res) => {
  try {
    // Find the role_id for "student" dynamically
    const studentRole = await UserRoles.findOne({ where: { role_name: 'student' } });

    if (!studentRole) {
      return res.status(404).json({ message: 'Student role not found' });
    }

    // Fetch students with specific fields
    const students = await Users.findAll({
      attributes: ['username', 'first_name', 'last_name', 'middle_initial', 'year_level'],
      where: { role_id: studentRole.role_id },
    });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'An error occurred while fetching student details', error });
  }
};

exports.getStaffDetails = async (req, res) => {
  try {

    const staffRole = await UserRoles.findOne({ where: { role_name: 'staff' } });

    if (!staffRole) {
      return res.status(404).json({
        message: 'Staff role not found'
      });
    }

    const staff = await Users.findAll({
      attributes: ['username', 'first_name', 'last_name', 'middle_initial'],
      where: { role_id: staffRole.role_id },
    });

    if (staff.length === 0) {
      return res.status(404).json({ message: 'No staff found' });
    }
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error fetching staff details:', error);
    res.status(500).json({ message: 'An error occurred while fetching staff details', error });
  }
};


exports.importStudents = async (req, res) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '../', req.file.path);

    // Read and parse Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const studentData = xlsx.utils.sheet_to_json(sheet);

    // Hashing passwords asynchronously
    const hashedUsers = await Promise.all(
      studentData.map(async (student) => ({
        username: student.username,
        first_name: student.first_name,
        last_name: student.last_name,
        middle_initial: student.middle_initial,
        year_level: student.year_level,
        password: await bcrypt.hash(student.username, 10), // Hashing the password
        role_id: 1,
        contact_number: null,
        status: 'active', // Default status is 'active'
        picture: null, // Default picture is null
        email: student.email || `${student.username}@example.com`, // Default email
      }))
    );

    // Bulk create students in the database
    await Users.bulkCreate(hashedUsers, { validate: true });

    // Delete the uploaded file after processing
    fs.unlinkSync(filePath);

    res.status(201).json({ message: 'Students imported successfully', users: hashedUsers });
  } catch (error) {
    console.error('Error importing students:', error);

    // Ensure uploaded file is deleted even if there's an error
    if (req.file) {
      const filePath = path.join(__dirname, '../', req.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ error: 'Failed to import students' });
  }
};
