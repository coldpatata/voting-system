const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", 
    port: 465,              
    secure: true,         
    auth: {
        user: "vnhssslg2024@gmail.com", 
        pass: "SSLG@2024"    
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: 'vnhssslg2024@gmail.com', 
            to,                                           
            subject,                                    
            text,                                        
            html                                          
        });
        console.log(`Email sent to ${to}`);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;
