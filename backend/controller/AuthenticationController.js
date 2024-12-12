const bcrypt = require('bcrypt');
const db = require('../models/main'); // Adjust path as necessary
const { createTokens, validateToken } = require('../middlewares/jwt')
const { Users } = db;

module.exports = {
    Register: async (req, res) => {
        try {
            const { username, password, email, first_name, middle_initial, last_name, year_level, role_id, section, contact_number, status } = req.body;
            console.log("USER REGISTRATION DATA: ", req.body);

            // Hash the password
            const hash = await bcrypt.hash(password, 10);

            // Create the user
            const newUser = await Users.create({
                username,
                password: hash,
                email,
                first_name,
                middle_initial,
                last_name,
                year_level,
                role_id,
                section,
                contact_number,
                status
            });

            res.json("USER REGISTERED");
        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    Login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await Users.findOne({ where: { username: username } });

            if (!user && !password) {
                return res.status(400).json({
                    error: "There is no input"
                });
            }

            if (!user) {
                return res.status(400).json({ error: "Provide user input" });
            }
            if (!password) {
                return res.status(400).json({ error: "Provide password input" });
            }

            const dbPassword = user.password;
            const match = await bcrypt.compare(password, dbPassword);

            if (!match) {
                return res.status(400).json({ error: "Wrong username and password combination" });
            } else {
                const accessToken = createTokens(user);
                // Send a success response
                res.json({
                    message: `Logged in! User ID: ${user.user_id} Username: ${user.username} User type: ${user.role_id}`,
                    accessToken: accessToken,
                    role_id: user.role_id,
                    uid: user.user_id
                });
            }

        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).send("Internal Server Error", error.message);
        }
    },

    ResetPassword: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check if both email and password are provided
            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required." });
            }

            // Find the user by email
            const user = await Users.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            
            await user.update({ password: hashedPassword });

            return res.status(200).json({
                message: "Password updated successfully.",
                user_id: user.user_id,
                username: user.username,
                role_id: user.role_id
            });
        } catch (error) {
            console.error("Error:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

};
