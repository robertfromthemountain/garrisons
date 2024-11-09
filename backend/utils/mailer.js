const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,  // Replace with your Mailtrap or other SMTP service host
    port: process.env.MAILTRAP_PORT,  // Replace with the correct port
    auth: {
        user: process.env.MAILTRAP_USER, // Mailtrap or other service user
        pass: process.env.MAILTRAP_PASS, // Mailtrap or other service password
    }
});

// Function to send an email
const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;  // Propagate the error to the calling function
    }
};

module.exports = {
    sendEmail
};
