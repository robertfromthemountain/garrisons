const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../database/database'); // Adjust path if needed
const { authenticateToken } = require('../middlewares/authenticate'); // Adjust path if needed
const { sendEmail } = require('../../utils/mailer'); // Import sendEmail function

const router = express.Router();

// Registration with email verification:
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if email already exists in the `users` table
        const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(emailCheckQuery, [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'Email is already registered in the system' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Generate verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');

            // Insert the user into the `users` table with 'pending' status
            const sqlInsert = `INSERT INTO users (firstName, lastName, email, phoneNumber, password, status, verification_token) VALUES (?, ?, ?, ?, ?, 'pending', ?)`;
            db.query(sqlInsert, [firstName, lastName, email, phoneNumber, hashedPassword, verificationToken], (err, insertResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Database error during registration' });
                }

                // Send the verification email
                const verificationLink = `http://localhost:5000/api/verify-email?token=${verificationToken}`;
                const fullName = firstName + " " + lastName;
                const mailOptions = {
                    from: 'noreply@yourapp.com',
                    to: email,
                    subject: 'Please verify your email',
                    html: `
                            <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
    <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
        <h2 style="color: #8f6a48;">Welcome to Garrison's Haircraft & Barbershop! Please Verify Your Email</h2>
        <p>Hi <strong>${fullName}</strong>,</p>
        <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>
        <p style="color: #0c0a09;">Welcome to <strong>Garrison's Haircraft & Barbershop</strong> – we’re thrilled to have you with us!</p>
        <br>
        <p style="color: #0c0a09;">Before you get started, we just need to verify your email address to activate your account and ensure the security of your details.</p>
        <br>
        <p style="color: #0c0a09;">To complete your registration, simply click the link below:</p>
        <a href="${verificationLink}" style="background-color: #8f6a48; color: #fff; padding: 10px 15px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Verify My Email</a>
        <br><br>
        <p style="color: #0c0a09;">If the above button doesn't work, copy and paste the following URL into your browser:</p>
        <p style="color: #0c0a09;"><a href="${verificationLink}" style="color: #8f6a48; text-decoration: none;">${verificationLink}</a></p>
        <br>
        <p style="color: #0c0a09;">Once your email is verified, you'll have access to:</p>
        <ul style="color: #0c0a09;">
            <li>Exclusive offers and promotions</li>
            <li>Easy booking for your favorite services</li>
            <li>Personalized recommendations just for you</li>
        </ul>
        <p style="color: #0c0a09;">If you didn’t create an account with us, please ignore this email.</p>
        <br>
        <p style="color: #0c0a09;">Thank you for choosing <strong>Garrison's Haircraft</strong>. We look forward to giving you an exceptional experience!</p>
        <br>
        <p style="color: #0c0a09;">Best regards,</p>
        <p style="color: #0c0a09;">The Garrison's Haircraft Team</p>
        <p style="color: #0c0a09;"><strong>noreply@garrisons.com</strong></p>
    </div>
</div>

                            `
                };

                // Send verification email using the exported sendEmail function
                sendEmail(mailOptions)
                    .then(() => res.status(201).json({ message: 'Verification email sent' }))
                    .catch((error) => res.status(500).json({ message: 'Error sending verification email' }));
            });
        });
    } catch (error) {
        console.error('Error in registration:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Email verification
router.get('/verify-email', (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send('Invalid verification link');
    }

    // Find the user with the verification token in the `users` table
    const findUserQuery = 'SELECT * FROM users WHERE verification_token = ? AND status = "pending"';
    db.query(findUserQuery, [token], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.status(400).send('Invalid or expired token');
        }

        // Update user status to 'confirmed' and clear the verification token
        const updateUserQuery = 'UPDATE users SET status = "confirmed", verification_token = NULL WHERE verification_token = ?';
        db.query(updateUserQuery, [token], (err, updateResult) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Database error during account activation');
            }

            res.status(200).send('Email successfully verified. Your account is now active.');
        });
    });
});

// Login endpoint
router.post('/login', async (req, res) => {
    console.log('Login request for email:', req.body.email);
    const { email, password } = req.body;

    try {
        const sqlSelect = 'SELECT * FROM users WHERE email = ?';
        db.query(sqlSelect, [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }

            if (results.length > 0) {
                const user = results[0];

                // Check the password first
                const validPassword = await bcrypt.compare(password, user.password);

                if (validPassword) {
                    // Check user's status
                    if (user.status === 'pending') {
                        return res.status(603).json({ message: 'Please verify your email to activate your account.' });
                    } else if (user.status === 'banned') {
                        return res.status(604).json({ message: 'Your account has been banned. Contact support for further assistance.' });
                    } else if (user.status === 'confirmed') {
                        // If password is valid and user is confirmed, generate JWT token
                        const token = jwt.sign(
                            {
                                userId: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                phoneNumber: user.phoneNumber,
                                role: user.role,
                            },
                            process.env.JWT_SECRET,
                            { expiresIn: '1h' }
                        );

                        console.log("User logged in with role:", user.role);
                        return res.json({ token, role: user.role });
                    } else {
                        // Handle unexpected status
                        return res.status(400).json({ message: 'Unexpected account status. Please contact support.' });
                    }
                } else {
                    // Invalid password
                    return res.status(401).send('Invalid credentials');
                }
            } else {
                // User not found
                return res.status(404).send('User not found');
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

// Refresh token route
router.post('/api/refresh-token', (req, res) => {
    // Get refresh token from Authorization header or request body
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];

    // If there's no refresh token in the header or body, return an error
    if (!refreshToken) {
        return res.status(403).json({ message: 'No refresh token provided' });
    }

    // Verify the refresh token using JWT
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // If valid, generate a new access token
        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET, // Your access token secret
            { expiresIn: '15m' } // Set the expiration for the new access token
        );

        // Send the new access token back to the client
        res.json({ accessToken });
    });
});

module.exports = router;
