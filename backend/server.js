const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const crypto = require('crypto');
const { formatDate, formatTime } = require('./dateFormatter');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration to store images in the 'garrisons/frontend/public/images' directory 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../frontend/public/images')); // Upload destination folder
    },
    filename: (req, file, cb) => {
        const randomString = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(file.originalname); // Get the file extension
        const uniqueFilename = `${Date.now()}-${randomString}${ext}`;
        cb(null, uniqueFilename);
    },
});


// Define allowed file types (MIME types)
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// Validate file type and size before saving
const fileFilter = (req, file, cb) => {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
    }
    cb(null, true); // Accept the file if valid
};

// Limit file size to 2MB per file and allow up to 10 files
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit per file
}).array('images', 10); // .array for multiple file uploads, limit to 10 files

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
const corsOptions = {
    origin: 'http://localhost:5173', // The frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));


// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'garrisons'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

/*
---------------MIDDLEWARES:---------------
*/
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("No token provided"); // Log this
        return res.sendStatus(401); // No token, Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Token verification failed:", err.message); // Log token errors
            return res.status(403).send('Forbidden: Invalid token');
        }

        req.user = user; // Attach user data to req.user
        console.log("Token successfully decoded. User:", user);
        next();
    });
}

function isAdmin(req, res, next) {
    const userId = req.user.userId; // Extract the userId from the decoded JWT
    const sql = 'SELECT role FROM users WHERE id = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            console.log("User not found in database");
            return res.status(404).json({ message: 'User not found' });
        }

        const userRole = results[0].role;
        if (userRole === 'admin') {
            next(); // User is admin, proceed to the next middleware or route
        } else {
            console.log("User is not an admin");
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
    });
}



//Nodemailer
const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '2ffdd7c9108046', // Replace with Mailtrap username
        pass: '378385174926c2'  // Replace with Mailtrap password
    }
});


// API route for uploading multiple images
app.post('/api/upload-images', authenticateToken, isAdmin, (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            // Handle errors from multer (e.g., file type or size errors)
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(400).json({ message: err.message });
        }

        // If no files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Array to store the image paths
        const imagePaths = req.files.map(file => `/images/${file.filename}`);

        // Prepare SQL insert statement for multiple files
        const sql = 'INSERT INTO reference_images (image_path, created_at) VALUES ?';
        const values = imagePaths.map(path => [path, new Date()]);

        // Insert image paths into the database
        db.query(sql, [values], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.status(201).json({ message: 'Images uploaded successfully', imagePaths });
        });
    });
});

// API route for getting paginated images 
app.get('/api/images', (req, res) => {
    const page = parseInt(req.query.page) || 1; const limit = parseInt(req.query.limit) || 6; const offset = (page - 1) * limit;
    const sql = 'SELECT * FROM reference_images ORDER BY created_at DESC LIMIT ? OFFSET ?';
    db.query(sql, [limit, offset], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
});

// API route to delete an image by ID
app.delete('/api/images/:id', authenticateToken, isAdmin, (req, res) => {
    const imageId = req.params.id;

    // First, retrieve the image path from the database
    const sqlSelect = 'SELECT image_path FROM reference_images WHERE id = ?';
    db.query(sqlSelect, [imageId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const imagePath = result[0].image_path;
        const fullImagePath = path.join(__dirname, '../frontend/public', imagePath);

        // Delete the image file from the filesystem
        fs.unlink(fullImagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ message: 'Error deleting image file' });
            }

            // Once the file is deleted, delete the record from the database
            const sqlDelete = 'DELETE FROM reference_images WHERE id = ?';
            db.query(sqlDelete, [imageId], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Database error' });
                }

                res.status(200).json({ message: 'Image deleted successfully' });
            });
        });
    });
});

// Refresh Token Route
app.post('/api/refresh-token', (req, res) => {
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



// Registration with email verification:
app.post('/register', async (req, res) => {
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
                const verificationLink = `http://localhost:5000/verify-email?token=${verificationToken}`;
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
});

// Email verification
app.get('/verify-email', (req, res) => {
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

//This ensures that the token is validated on the server, preventing any tampering on the client side
app.get('/verify-token', (req, res) => {
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
});


// Login endpoint
app.post('/login', async (req, res) => {
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

// Get confirmed events from the unified events table
app.get('/api/getEvents', (req, res) => {
    const sqlQuery = `
        SELECT 
            events.event_id, 
            events.event_date, 
            events.event_start, 
            events.event_end, 
            events.user_id AS reserving_user_id, 
            events.confirmed_at, 
            services.title AS service_title, 
            services.duration AS service_duration,
            services.price AS service_price,
            services.backgroundColor AS service_backgroundColor,
            users.firstName AS user_firstName,
            users.lastName AS user_lastName,
            users.email AS user_email,
            users.phoneNumber AS user_phoneNumber
        FROM
            events
        JOIN
            services
        ON
            events.service_id = services.id
        JOIN
            users
        ON
            events.user_id = users.id
        WHERE
            events.status = 'confirmed';
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).send('Error fetching events');
        }

        // Ensure results is an array before mapping
        if (Array.isArray(results)) {
            const fullCalendarEvents = results.map(event => ({
                id: event.event_id,
                title: event.service_title,
                service_duration: event.service_duration,
                price: event.service_price,
                start: event.event_start,
                end: event.event_end,
                reserving_user_id: event.reserving_user_id,
                firstName: event.user_firstName,
                lastName: event.user_lastName,
                email: event.user_email,
                phoneNumber: event.user_phoneNumber,
                confirmed_at: event.confirmed_at,
                backgroundColor: event.service_backgroundColor,
            }));
            return res.json(fullCalendarEvents);
        } else {
            return res.status(500).send('No events found');
        }
    });
});



// Get services
app.get('/api/services', (req, res) => {
    db.query('SELECT * FROM services', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// CREATE a new service
app.post('/api/services', authenticateToken, isAdmin, (req, res) => {
    const { title, price, duration, backgroundColor } = req.body;
    const sql = 'INSERT INTO services (title, price, duration, backgroundColor) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, price, duration, backgroundColor || '#8f6a48'], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, title, price, duration, backgroundColor });
    });
});

// UPDATE a service
app.put('/api/services/:id', authenticateToken, isAdmin, (req, res) => {
    const { id } = req.params;
    const { title, price, duration, backgroundColor } = req.body;
    const sql = 'UPDATE services SET title = ?, price = ?, duration = ?, backgroundColor = ? WHERE id = ?';
    db.query(sql, [title, price, duration, backgroundColor || '#8f6a48', id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Service updated successfully' });
    });
});

// DELETE a service
app.delete('/api/services/:id', authenticateToken, isAdmin, (req, res) => {
    const { id } = req.params;
    console.log("Service ID received for deletion:", req.params.id);
    const sql = 'DELETE FROM services WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Service deleted successfully' });
    });
});

// Get all business hours with formatted time
app.get('/api/business-hours', (req, res) => {
    const query = `
        SELECT 
            id, 
            daysOfWeek, 
            DATE_FORMAT(startTime, '%H:%i') AS startTime, 
            DATE_FORMAT(endTime, '%H:%i') AS endTime 
        FROM business_hours
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Update business hours for a specific day
app.put('/api/business-hours/:id', authenticateToken, isAdmin, (req, res) => {
    const { startTime, endTime } = req.body;
    const { id } = req.params;

    const sql = 'UPDATE business_hours SET startTime = ?, endTime = ? WHERE id = ?';
    db.query(sql, [startTime, endTime, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Business hours updated successfully' });
    });
});


// Protected route requiring authentication
app.get('/api/user', authenticateToken, (req, res) => {
    const userId = req.user.userId; // Access user ID from decoded token
    const email = req.user.email;
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;
    const phoneNumber = req.user.phoneNumber;

    // Optional: Fetch user details from database based on userId
    // ...

    res.json({ userId, email, firstName, lastName, phoneNumber });
});

// Create an event
app.post('/api/requestEvent', authenticateToken, (req, res) => {
    const { service_id, event_date, event_start, event_end, user_id } = req.body;

    // Check if required fields are provided
    if (!service_id || !event_date || !event_start || !event_end || !user_id) {
        return res.status(400).send('Missing required fields');
    }

    // Query to check the user's role
    const sqlCheckRole = 'SELECT role FROM users WHERE id = ?';
    db.query(sqlCheckRole, [user_id], (err, roleResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (roleResults.length === 0) {
            return res.status(404).send('User not found');
        }

        const userRole = roleResults[0].role;

        // If the user is an admin, skip the pending event check and auto-confirm the event
        if (userRole === 'admin') {
            insertEvent('confirmed', 'confirmed_event_bg', true); // Insert a confirmed event with the 'confirmed_at' field
        } else {
            // For regular users, check if they already have 3 pending events
            const sqlCountPendingEvents = 'SELECT COUNT(*) as pendingCount FROM events WHERE user_id = ? AND status = "pending"';
            db.query(sqlCountPendingEvents, [user_id], (err, countResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }

                const pendingCount = countResults[0].pendingCount;

                // If the user already has 3 pending events, reject the request
                if (pendingCount >= 3) {
                    return res.status(429).send('You already have 3 pending events.');
                }

                // Otherwise, insert the event as pending
                insertEvent('pending', 'pending_event_bg', false); // No 'confirmed_at' field for pending events
            });
        }

        // Helper function to insert an event with a given status
        function insertEvent(status, eventClass, isAdmin) {
            // If the user is an admin, insert the 'confirmed_at' field
            let sqlInsert = `INSERT INTO events (service_id, event_date, event_start, event_end, user_id, status, event_classes${isAdmin ? ', confirmed_at' : ''}) 
                             VALUES (?, ?, ?, ?, ?, ?, ?${isAdmin ? ', NOW()' : ''})`;

            db.query(sqlInsert, [service_id, event_date, event_start, event_end, user_id, status, eventClass], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }

                // Fetch user's full name
                const sqlUserSelect = 'SELECT firstName, lastName FROM users WHERE id = ?';
                db.query(sqlUserSelect, [user_id], (err, userResults) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Database error');
                    }
                    if (userResults.length > 0) {
                        const user = userResults[0];
                        const fullName = `${user.firstName} ${user.lastName}`;

                        // Fetch service details from the services table
                        const sqlServiceSelect = 'SELECT title, id, duration, price FROM services WHERE id = ?';
                        db.query(sqlServiceSelect, [service_id], (err, serviceResults) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send('Database error');
                            }
                            if (serviceResults.length > 0) {
                                const service = serviceResults[0];

                                // Format the dates and times using your utility functions
                                const formattedDate = formatDate(event_date);
                                const formattedStartTime = formatTime(event_start);
                                const formattedEndTime = formatTime(event_end);

                                // Send email to admin for confirmation if the event is pending
                                if (status === 'pending') {
                                    const mailOptions = {
                                        from: "Garrison's Haircraft And Barbershop <noreply@garrisons.com>",
                                        to: 'admin@example.com', // Admin's email address
                                        subject: 'New Appointment Request',
                                        html: `
                                        <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
                                            <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
                                                <h2 style="color: #8f6a48;">New Appointment Request</h2>
                                                <p>A new appointment has been requested by <strong>${fullName}</strong></p>
                                                <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>

                                                <p style="color: #0c0a09;"><strong>Service:</strong> ${service.title}</p>
                                                <p style="color: #0c0a09;"><strong>Duration:</strong> ${service.duration} minutes</p>
                                                <p style="color: #0c0a09;"><strong>Price:</strong> ${service.price} HUF</p>
                                                <p style="color: #0c0a09;"><strong>Date:</strong> ${formattedDate}</p>
                                                <p style="color: #0c0a09;"><strong>Start Time:</strong> ${formattedStartTime}</p>
                                                <p style="color: #0c0a09;"><strong>End Time:</strong> ${formattedEndTime}</p>
                                                <a href="http://localhost:5000/api/confirmEvent/${result.insertId}" style="background-color: #8f6a48; color: #fff; padding: 10px 15px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Confirm Appointment</a>
                                                <a href="http://localhost:5000/api/deletePendingEvent/${result.insertId}" style="background-color: #e6413d; color: #fff; padding: 10px 15px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Deny Appointment</a>
                                                <p style="color: #0c0a09;">If you have any questions, feel free to contact us.</p>
                                            </div>
                                        </div>
                                        `
                                    };

                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            console.error('Error sending email:', error);
                                            return res.status(500).send('Error sending email');
                                        }
                                        console.log('Email sent:', info.response);
                                    });
                                }

                                // Respond with the event data
                                res.status(201).json({ id: result.insertId, service_id, event_date, event_start, event_end, user_id, status });
                            } else {
                                return res.status(404).send('Service not found');
                            }
                        });
                    } else {
                        return res.status(404).send('User not found');
                    }
                });
            });
        }
    });
});


// Get pending events from the unified events table
app.get('/api/getPendingEvents2', (req, res) => {
    const sqlQuery = `
        SELECT 
            events.event_id, 
            events.event_date, 
            events.event_start, 
            events.event_end, 
            events.user_id, 
            events.reserved_at, 
            events.event_classes,
            services.title AS service_title,
            services.duration AS service_duration,
            services.price AS service_price,
            users.firstName AS user_firstName,
            users.lastName AS user_lastName,
            users.email AS user_email,
            users.phoneNumber AS user_phoneNumber
        FROM 
            events
        JOIN 
            services
        ON 
            events.service_id = services.id
        JOIN 
            users
        ON 
            events.user_id = users.id
        WHERE 
            events.status = 'pending';
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).send('Error fetching events');
        }

        // Ensure results is an array before mapping
        if (Array.isArray(results)) {
            const fullCalendarEvents = results.map(event => ({
                id: event.event_id,
                title: event.service_title,
                service_duration: event.service_duration,
                price: event.service_price,
                start: event.event_start,
                end: event.event_end,
                reserving_user_id: event.user_id,
                firstName: event.user_firstName,
                lastName: event.user_lastName,
                email: event.user_email,
                phoneNumber: event.user_phoneNumber,
                reserved_at: event.reserved_at,
                classNames: event.event_classes,
            }));
            return res.json(fullCalendarEvents);
        } else {
            return res.status(500).send('No events found');
        }
    });
});

app.get('/api/confirmEvent/:id', (req, res) => {
    const eventId = req.params.id;

    // Find the pending event in the `events` table
    const sqlSelect = `
        SELECT events.*, services.title, services.duration, services.price, users.email, users.firstName, users.lastName
        FROM events
        JOIN services ON events.service_id = services.id
        JOIN users ON events.user_id = users.id
        WHERE events.event_id = ? AND events.status = 'pending'
    `;

    db.query(sqlSelect, [eventId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error fetching pending event');
        }

        if (!result || result.length === 0) {
            return res.status(404).send('Pending event not found');
        }

        const event = result[0];

        // Update the event's status to "confirmed" and assign the `confirmed_event_bg` class
        const sqlUpdate = `
            UPDATE events 
            SET status = 'confirmed', event_classes = 'confirmed_event_bg', confirmed_at = NOW()
            WHERE event_id = ?
        `;

        db.query(sqlUpdate, [eventId], (err, updateResult) => {
            if (err) {
                console.error('Error confirming event:', err.message);
                return res.status(500).send('Error confirming event');
            }

            // Send confirmation email to the user
            const userEmail = event.email;
            const userName = `${event.firstName} ${event.lastName}`;
            const formattedDate = formatDate(event.event_date);
            const formattedStartTime = formatTime(event.event_start);
            const formattedEndTime = formatTime(event.event_end);

            const mailOptions = {
                from: "Garrison's Haircraft And Barbershop <noreply@garrisons.com>",
                to: userEmail,
                subject: 'Appointment Confirmed',
                html: `
                <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
                    <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
                        <h2 style="color: #8f6a48;">Appointment Confirmed</h2>
                        <p>Dear <strong>${userName}</strong>,</p>
                        <p>Your appointment has been confirmed for the following service:</p>
                        <ul>
                            <li><strong>Service:</strong> ${event.title}</li>
                            <li><strong>Duration:</strong> ${event.duration} minutes</li>
                            <li><strong>Price:</strong> ${event.price} HUF</li>
                            <li><strong>Date:</strong> ${formattedDate}</li>
                            <li><strong>Start Time:</strong> ${formattedStartTime}</li>
                            <li><strong>End Time:</strong> ${formattedEndTime}</li>
                        </ul>
                        <p>If you have any questions, feel free to contact us.</p>
                    </div>
                </div>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending confirmation email:', error);
                    return res.status(500).send('Error sending confirmation email');
                }
                console.log('Confirmation email sent:', info.response);
            });

            res.send('Event confirmed, email sent to user');
        });
    });
});

// Deny (delete) a pending event
app.get('/api/deletePendingEvent/:id', (req, res) => {
    const eventId = req.params.id;

    // Fetch the event details and user's email before deleting
    const sqlSelect = `
        SELECT events.*, users.email, users.firstName, users.lastName, services.title, services.duration, services.price
        FROM events
        JOIN users ON events.user_id = users.id
        JOIN services ON events.service_id = services.id
        WHERE events.event_id = ? AND events.status = 'pending'
    `;

    db.query(sqlSelect, [eventId], (err, result) => {
        if (err) {
            console.error('Error fetching pending event:', err);
            return res.status(500).send('Error fetching pending event');
        }

        if (result.length === 0) {
            return res.status(404).send('Pending event not found');
        }

        const event = result[0];
        const userEmail = event.email;
        const userName = `${event.firstName} ${event.lastName}`;
        const formattedDate = formatDate(event.event_date);
        const formattedStartTime = formatTime(event.event_start);
        const formattedEndTime = formatTime(event.event_end);

        // Send the denial email
        const mailOptions = {
            from: "Garrison's Haircraft And Barbershop <noreply@garrisons.com>",
            to: userEmail,
            subject: 'Appointment Denied',
            html: `
            <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
                <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #8f6a48;">Appointment Denied</h2>
                    <p>Dear <strong>${userName}</strong>,</p>
                    <p>We regret to inform you that your appointment request for the following service has been denied:</p>
                    <ul>
                        <li><strong>Service:</strong> ${event.title}</li>
                        <li><strong>Duration:</strong> ${event.duration} minutes</li>
                        <li><strong>Price:</strong> ${event.price} HUF</li>
                        <li><strong>Date:</strong> ${formattedDate}</li>
                        <li><strong>Start Time:</strong> ${formattedStartTime}</li>
                        <li><strong>End Time:</strong> ${formattedEndTime}</li>
                    </ul>
                    <p>If you have any questions, feel free to contact us.</p>
                </div>
            </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending denial email:', error);
                return res.status(500).send('Error sending denial email');
            }
            console.log('Denial email sent:', info.response);

            // Delete the pending event from the events table
            const sqlDelete = 'DELETE FROM events WHERE event_id = ? AND status = "pending"';
            db.query(sqlDelete, [eventId], (err) => {
                if (err) {
                    console.error('Error deleting pending event:', err);
                    return res.status(500).send('Error deleting pending event');
                }

                res.send('Event denied and deleted, email sent to user');
            });
        });
    });
});

app.post('/api/updateConfirmedEvents', authenticateToken, isAdmin, async (req, res) => {
    const modifiedEvents = req.body;

    try {
        // Use Promise.all to handle all queries asynchronously
        const updatePromises = modifiedEvents.map(event => {
            return new Promise((resolve, reject) => {
                const sql = `
                UPDATE events 
                SET event_date = ?, event_start = ?, event_end = ?
                WHERE event_id = ?
                `;

                db.query(sql, [
                    event.modifiedEventDate,
                    event.newStart,
                    event.newEnd,
                    event.id
                ], (err, result) => {
                    if (err) return reject(err);
                    console.log("Event ID for SQL select:", event.id);

                    // Fetch event details (including email) after the event is updated
                    const sqlSelect = `
  SELECT users.email, users.firstName, users.lastName, services.title, events.event_date, events.event_start, events.event_end
  FROM events
  JOIN users ON events.user_id = users.id
  JOIN services ON events.service_id = services.id
  WHERE events.event_id = ?
`;


                    db.query(sqlSelect, [event.id], (err, eventDetails) => {
                        if (err || eventDetails.length === 0) {
                            console.error("Error fetching event details or no event found.");
                            return reject('Error fetching event details.');
                        }

                        const eventData = eventDetails[0];  // The updated event data
                        const fullName = `${eventData.firstName} ${eventData.lastName}`;
                        const formattedDate = formatDate(eventData.event_date);
                        const formattedStartTime = formatTime(eventData.event_start);
                        const formattedEndTime = formatTime(eventData.event_end);

                        // Construct the email HTML content
                        const emailContent = `
                        <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
                          <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
                              <h2 style="color: #8f6a48;">Appointment Updated at Garrison's Haircraft</h2>
                              <p>Hi <strong>${fullName}</strong>,</p>
                              <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>
                              <p style="color: #0c0a09;">Your appointment has been updated with the following details:</p>
                              <br>
                              <p style="color: #0c0a09;"><strong>Service:</strong> ${eventData.title}</p>
                              <p style="color: #0c0a09;"><strong>Date:</strong> ${formattedDate}</p>
                              <p style="color: #0c0a09;"><strong>Start Time:</strong> ${formattedStartTime}</p>
                              <p style="color: #0c0a09;"><strong>End Time:</strong> ${formattedEndTime}</p>
                              <br>
                              <p style="color: #0c0a09;">If you have any questions, feel free to contact us.</p>
                              <br>
                              <p style="color: #0c0a09;">Best regards,</p>
                              <p style="color: #0c0a09;">The Garrison's Haircraft Team</p>
                              <p style="color: #0c0a09;"><strong>noreply@garrisons.com</strong></p>
                          </div>
                        </div>`;

                        // Send the feedback email
                        const mailOptions = {
                            from: "Garrison's Haircraft <noreply@garrisons.com>",
                            to: eventData.email,  // User's email
                            subject: 'Your Appointment has been Updated',
                            html: emailContent  // The constructed HTML email content
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('Error sending update email:', error);
                            } else {
                                console.log('Update email sent:', info.response);
                            }
                        });
                        resolve();
                    });
                });
            });
        });

        // Wait for all promises to resolve
        await Promise.all(updatePromises);

        // Once all events are updated, send a success response
        res.send('Events updated successfully and feedback emails sent.');

    } catch (error) {
        console.error('Error updating events:', error);
        res.status(500).send('An error occurred while updating events.');
    }
});

// Delete confirmed event and send feedback email
app.delete('/api/deleteEvent/:id', authenticateToken, isAdmin, (req, res) => {
    const confirmedEventId = req.params.id;

    // Fetch event details, including user information, before deletion
    const sqlSelect = `
        SELECT users.email, users.firstName, users.lastName, services.title, events.event_date, events.event_start, events.event_end
        FROM events
        JOIN users ON events.user_id = users.id
        JOIN services ON events.service_id = services.id
        WHERE events.event_id = ?
    `;

    db.query(sqlSelect, [confirmedEventId], (err, eventDetails) => {
        if (err) {
            console.error('Error fetching event details:', err);
            return res.status(500).send('Error fetching event details');
        }

        if (eventDetails.length === 0) {
            return res.status(404).send('Event not found');
        }

        const eventData = eventDetails[0];
        const fullName = `${eventData.firstName} ${eventData.lastName}`;
        const formattedDate = formatDate(eventData.event_date);
        const formattedStartTime = formatTime(eventData.event_start);
        const formattedEndTime = formatTime(eventData.event_end);

        // Now proceed to delete the event
        const sqlDelete = 'DELETE FROM events WHERE event_id = ?';
        db.query(sqlDelete, [confirmedEventId], (err, result) => {
            if (err) {
                console.error('Error deleting event:', err);
                return res.status(500).send('Error deleting event');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Event not found');
            }

            // Send feedback email to the user after successful deletion
            const mailOptions = {
                from: "Garrison's Haircraft <noreply@garrisons.com>",
                to: eventData.email,
                subject: 'Your Appointment has been Cancelled',
                html: `
                <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
                  <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
                      <h2 style="color: #e6413d;">Appointment Cancelled at Garrison's Haircraft</h2>
                      <p>Hi <strong>${fullName}</strong>,</p>
                      <div style="height: 1px; background-color: #e6413d; margin: 20px 0; width: 100%;"></div>
                      <p style="color: #0c0a09;">We regret to inform you that your appointment for the following service has been cancelled:</p>
                      <p><strong>Service:</strong> ${eventData.title}</p>
                      <p><strong>Date:</strong> ${formattedDate}</p>
                      <p><strong>Start Time:</strong> ${formattedStartTime}</p>
                      <p><strong>End Time:</strong> ${formattedEndTime}</p>
                      <br>
                      <p style="color: #0c0a09;">If you have any questions or would like to reschedule, please feel free to contact us.</p>
                      <p>Best regards,<br>The Garrison's Haircraft Team</p>
                  </div>
                </div>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending cancellation email:', error);
                } else {
                    console.log('Cancellation email sent:', info.response);
                }
            });

            res.status(200).send('Event deleted successfully and feedback email sent');
        });
    });
});

// GET all users
app.get('/api/users', authenticateToken, isAdmin, (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


// UPDATE a user
app.put('/api/users/:id', authenticateToken, isAdmin, (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, role, email, phoneNumber, status } = req.body;
    const sql = 'UPDATE users SET firstName = ?, lastName = ?, role = ?, email = ?, phoneNumber = ?, status = ? WHERE id = ?';
    db.query(sql, [firstName, lastName, role, email, phoneNumber, status, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'User updated successfully' });
    });
});


// DELETE a user
app.delete('/api/users/:id', authenticateToken, isAdmin, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'User deleted successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});