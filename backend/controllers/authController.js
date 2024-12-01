const db = require('../models/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { validateFirstName, validateLastName, validateEmail, validatePhone, validatePassword } = require('../utils/validator');
const {
    registerEmailTemplate,
    passwordResetTemplate,
    pwdResetSuccess,
} = require('../mailer/templates');
const transporter = require('../utils/transporter');

exports.login = async (req, res) => {
    console.log('Login request for email:', req.body.email);
    const { email, password } = req.body;

    const errors = [];

    // Validate input
    const emailError = validateEmail(email);
    if (emailError) errors.push({ field: 'email', message: emailError });

    const passwordError = validatePassword(password);
    if (passwordError) errors.push({ field: 'password', message: passwordError });

    // If validation errors exist, return them
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors });
    }

    try {
        const sqlSelect = 'SELECT * FROM users WHERE email = ?';
        db.query(sqlSelect, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Database error');
            }

            if (results.length > 0) {
                const user = results[0];

                // Check if the password is valid
                const validPassword = await bcrypt.compare(password, user.password);

                if (validPassword) {
                    // Handle user status
                    if (user.status === 'pending') {
                        return res.status(603).json({ message: 'Please verify your email to activate your account.' });
                    } else if (user.status === 'banned') {
                        return res.status(604).json({ message: 'Your account has been banned. Contact support for further assistance.' });
                    } else if (user.status === 'confirmed') {
                        // Generate JWT token
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

                        console.log('User logged in with role:', user.role);
                        return res.json({ token, role: user.role });
                    } else {
                        // Unexpected account status
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
        console.error('Server error:', error);
        return res.status(500).send('Server error');
    }
};


exports.register = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Perform validations
    const errors = [];
    const firstNameError = validateFirstName(firstName);
    if (firstNameError) errors.push({ field: 'firstName', message: firstNameError });

    const lastNameError = validateLastName(lastName);
    if (lastNameError) errors.push({ field: 'lastName', message: lastNameError });

    const emailError = validateEmail(email);
    if (emailError) errors.push({ field: 'email', message: emailError });

    const phoneError = validatePhone(phoneNumber);
    if (phoneError) errors.push({ field: 'phoneNumber', message: phoneError });

    const passwordError = validatePassword(password);
    if (passwordError) errors.push({ field: 'password', message: passwordError });

    // If there are validation errors, return them
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors });
    }

    try {
        // Check if email already exists in the `users` table
        const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(emailCheckQuery, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
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
            const sqlInsert = `
                INSERT INTO users (firstName, lastName, email, phoneNumber, password, status, verification_token)
                VALUES (?, ?, ?, ?, ?, 'pending', ?)
            `;
            db.query(sqlInsert, [firstName, lastName, email, phoneNumber, hashedPassword, verificationToken], (err) => {
                if (err) {
                    console.error('Database error during registration:', err);
                    return res.status(500).json({ message: 'Database error during registration' });
                }

                // Send the verification email
                const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
                const fullName = `${firstName} ${lastName}`;
                const mailOptions = {
                    from: 'noreply@yourapp.com',
                    to: email,
                    subject: 'Please verify your email',
                    html: registerEmailTemplate(fullName, verificationLink),
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending verification email:', error);
                        return res.status(500).json({ message: 'Error sending verification email' });
                    }

                    res.status(201).json({ message: 'Verification email sent' });
                });
            });
        });
    } catch (error) {
        console.error('Error in registration:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyEmail = (req, res) => {
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
        db.query(updateUserQuery, [token], (err) => {
            if (err) {
                console.error('Database error during account activation:', err);
                return res.status(500).send('Database error during account activation');
            }

            res.status(200).send('Email successfully verified. Your account is now active.');
        });
    });
};

exports.refreshToken = (req, res) => {
    // Get refresh token from Authorization header or request body
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];

    // If no refresh token, return an error
    if (!refreshToken) {
        return res.status(403).json({ message: 'No refresh token provided' });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET, // Access token secret
            { expiresIn: '15m' } // Set expiration time
        );

        // Send the new access token back to the client
        res.json({ accessToken });
    });
};

exports.verifyToken = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Return the user's role securely
        return res.json({ role: decoded.role });
    });
};

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    const sqlSelect = 'SELECT * FROM users WHERE email = ?';
    db.query(sqlSelect, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = results[0];

        // Check if the user's status is not pending or banned
        if (user.status === 'pending') {
            return res.status(603).send('Your account is pending. Please verify your email first.');
        }

        if (user.status === 'banned') {
            return res.status(603).send('Your account is banned. Contact support for assistance.');
        }

        // Generate a secure token
        const resetToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        // Create a reset link
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: 'garrisons@noreply.hu',
            to: user.email,
            subject: 'Password Reset Request',
            html: passwordResetTemplate(resetLink),
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error('Failed to send password reset email:', error);
                return res.status(500).send('Failed to send email');
            }

            res.status(200).send('Password reset email sent');
        });
    });
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).send('Missing token or new password');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.email;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const sqlUpdate = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(sqlUpdate, [hashedPassword, decoded.userId], async (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Database error');
            }

            // Send a success email to the user
            try {
                const mailOptions = {
                    from: 'garrisons@noreply.hu',
                    to: userEmail,
                    subject: 'Password Changed Successfully',
                    html: pwdResetSuccess(),
                };

                await transporter.sendMail(mailOptions);

                res.status(200).send('Password has been reset successfully, and a confirmation email has been sent.');
            } catch (emailError) {
                console.error('Failed to send success email:', emailError);
                return res.status(500).send('Password reset successful, but failed to send confirmation email.');
            }
        });
    } catch (error) {
        console.error('Invalid or expired token:', error);
        res.status(400).send('Invalid or expired token');
    }
};