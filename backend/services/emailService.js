const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", // Use your SMTP server host (e.g., Gmail, Outlook, etc.)
    port: 465,              // Use 465 for secure, or 587 for non-secure
    secure: true,          // Use true for 465, false for others
    auth: {
        user: "flexperienceadmin@flexperience.pro", // Your email address
        pass: "Capstone-123"     // Your email password or app password
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: 'flexperienceadmin@flexperience.pro', // Sender's email
            to,                                           // Recipient's email
            subject,                                      // Subject line
            text,                                         // Plain text version
            html                                          // HTML version
        });
        console.log(`Email sent to ${to}`);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;
