const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({}));

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

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // No token found
    if (!token) return res.status(403).send('Access denied');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user;
        next();
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

// Registration with email verification:
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if email already exists in the `users` table
        const emailCheckQuery = 'SELECT * from users WHERE email = ?';
        db.query(emailCheckQuery, [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'Email is already registered in the system' });
            }

            // Check if email is already pending verification
            const pendingEmailCheckQuery = 'SELECT * from pending_users WHERE pending_email = ?';
            db.query(pendingEmailCheckQuery, [email], async (err, pendingResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Database error' });
                }

                if (pendingResults.length > 0) {
                    return res.status(400).json({ message: 'Email is already pending verification.' });
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Generate verification token
                const verificationToken = crypto.randomBytes(32).toString('hex');

                // Insert the user into the `pending_users` table
                const sqlInsert = `INSERT INTO pending_users (pending_firstName, pending_lastName, pending_email, pending_phoneNumber, pending_password, verification_token) VALUES (?, ?, ?, ?, ?, ?)`;
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
                        // html: `<p>Hello ${firstName},</p><p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`
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

    // Find the user with the verification token
    const findPendingUserQuery = 'SELECT * FROM pending_users WHERE verification_token = ?';
    db.query(findPendingUserQuery, [token], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.status(400).send('Invalid or expired token');
        }

        const { pending_firstName, pending_lastName, pending_email, pending_phoneNumber, pending_password } = results[0];

        // Move the user from `pending_users` to `users` table
        const insertUserQuery = 'INSERT INTO users (firstName, lastName, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?)';
        db.query(insertUserQuery, [pending_firstName, pending_lastName, pending_email, pending_phoneNumber, pending_password], (err, insertResult) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Database error during account activation');
            }

            // Remove the user from `pending_users` after successful verification
            const deletePendingUserQuery = 'DELETE FROM pending_users WHERE verification_token = ?';
            db.query(deletePendingUserQuery, [token], (err, deleteResult) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).send('Database error');
                }

                res.status(200).send('Email successfully verified. Your account is now active.');
            });
        });
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
                res.status(500).send('Database error');
                return;
            }
            if (results.length > 0) {
                const user = results[0];
                const validPassword = await bcrypt.compare(password, user.password);
                if (validPassword) {
                    const token = jwt.sign(
                        { userId: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }, // ITT ADOM HOZZA A TOKENHEZ A DOLGOKAT
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                    res.json({ token });
                } else {
                    res.status(401).send('Invalid credentials');
                }

            } else {
                res.status(404).send('User not found');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get events
app.get('/api/getEvents', (req, res) => {
    const sqlQuery = `
        SELECT 
            confirmed_events.confirmed_event_id, 
            confirmed_events.confirmed_event_date, 
            confirmed_events.confirmed_event_start, 
            confirmed_events.confirmed_event_end, 
            confirmed_events.reserving_user_id, 
            confirmed_events.confirmed_at, 
            services.title AS service_title, 
            services.price AS service_price, 
            services.duration AS service_duration
        FROM 
            confirmed_events
        JOIN 
            services
        ON 
            confirmed_events.confirmed_service_id = services.id;
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).send('Error fetching events');
        }

        // Ensure results is an array before mapping
        if (Array.isArray(results)) {
            const fullCalendarEvents = results.map(event => ({
                id: event.confirmed_event_id,
                title: event.service_title,  // Use service title instead of event title
                start: event.confirmed_event_start,
                end: event.confirmed_event_end,
                reserving_user_id: event.reserving_user_id,
                service_duration: event.service_duration,
                service_price: event.service_price
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
app.post('/api/services', (req, res) => {
    const { title, price, duration } = req.body;
    const sql = 'INSERT INTO services (title, price, duration) VALUES (?, ?, ?)';
    db.query(sql, [title, price, duration], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, title, price, duration });
    });
});

// UPDATE a service
app.put('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const { title, price, duration } = req.body;
    const sql = 'UPDATE services SET title = ?, price = ?, duration = ? WHERE id = ?';
    db.query(sql, [title, price, duration, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Service updated successfully' });
    });
});

// DELETE a service
app.delete('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM services WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Service deleted successfully' });
    });
});

// Protected route requiring authentication
app.get('/api/user', authenticateToken, (req, res) => {
    const userId = req.user.userId; // Access user ID from decoded token
    const email = req.user.email;
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;

    // Optional: Fetch user details from database based on userId
    // ...

    res.json({ userId, email, firstName, lastName });
});

// Create an event
app.post('/api/requestEvent', authenticateToken, (req, res) => {
    const { pending_service_id, pending_date, pending_start_of_event, pending_end_of_event, user_id } = req.body;

    // Check if required fields are provided
    if (!pending_service_id || !pending_date || !pending_start_of_event || !pending_end_of_event || !user_id) {
        return res.status(400).send('Missing required fields');
    }

    const sqlInsert = `INSERT INTO pending_events (pending_service_id, pending_date, pending_start_of_event, pending_end_of_event, user_id) VALUES (?, ?, ?, ?, ?)`;
    db.query(sqlInsert, [pending_service_id, pending_date, pending_start_of_event, pending_end_of_event, user_id], (err, result) => {
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

                // Fetch service details from services table
                const sqlServiceSelect = 'SELECT title, id, duration, price FROM services WHERE id = ?';
                db.query(sqlServiceSelect, [pending_service_id], (err, serviceResults) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Database error');
                    }
                    if (serviceResults.length > 0) {
                        const service = serviceResults[0];

                        // Send email to admin for confirmation
                        const mailOptions = {
                            from: "Garrison's Haircraft And Barbershop <noreply@garrisons.com>",
                            to: 'naboha7589@skrak.com', // Admin's email address
                            subject: 'New Appointment Request',
                            html: `
                            <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
                                <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
                                    <h2 style="color: #8f6a48;">New Appointment Request</h2>
                                    <p>A new appointment has been requested by <strong>${fullName}</strong></p>
                                    <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>

                                    <p style="color: #0c0a09;"><strong>Service:</strong> ${service.title}</p>
                                    <p style="color: #0c0a09;"><strong>Service ID:</strong> ${service.id}</p>
                                    <p style="color: #0c0a09;"><strong>Duration:</strong> ${service.duration} minutes</p>
                                    <p style="color: #0c0a09;"><strong>Price:</strong> $${service.price}</p>
                                    <p style="color: #0c0a09;"><strong>Date:</strong> ${pending_date}</p>
                                    <p style="color: #0c0a09;"><strong>Start Time:</strong> ${pending_start_of_event}</p>
                                    <p style="color: #0c0a09;"><strong>End Time:</strong> ${pending_end_of_event}</p>
                                    <a href="http://localhost:5000/api/confirmEvent/${result.insertId}" style="background-color: #8f6a48; color: #fff; padding: 10px 15px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Confirm Appointment</a>
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

                        // Respond with the event data
                        res.status(201).json({ id: result.insertId, pending_service_id, pending_date, pending_start_of_event, pending_end_of_event, user_id });
                    } else {
                        return res.status(404).send('Service not found');
                    }
                });
            } else {
                return res.status(404).send('User not found');
            }
        });
    });
});


// GET all pending events
app.get('/api/getPendingEvents', (req, res) => {
    db.query('SELECT * FROM pending_events', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Get pending events TEST ONLY FOR THE BG!!!!!!
app.get('/api/getPendingEvents2', (req, res) => {
    const sqlQuery = `
        SELECT 
            pending_events.pending_event_id, 
            pending_events.pending_date, 
            pending_events.pending_start_of_event, 
            pending_events.pending_end_of_event, 
            pending_events.user_id, 
            pending_events.created_at, 
            pending_events.pending_event_classes,
            services.title AS service_title
        FROM 
            pending_events
        JOIN 
            services
        ON 
            pending_events.pending_service_id = services.id;
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).send('Error fetching events');
        }

        // Ensure results is an array before mapping
        if (Array.isArray(results)) {
            const fullCalendarEvents = results.map(event => ({
                id: event.pending_event_id,
                title: event.service_title,  // Use service title instead of event title
                start: event.pending_start_of_event,
                end: event.pending_end_of_event,
                reserving_user_id: event.reserving_user_id,
                classNames: event.pending_event_classes,
            }));
            return res.json(fullCalendarEvents);
        } else {
            return res.status(500).send('No events found');
        }
    });
});

// Confirm a pending event:
app.get('/api/confirmEvent/:id', (req, res) => {
    const pendingEventId = req.params.id;
    console.log('Pending event id-je:', req.params);

    // Find the pending event by ID
    const sqlSelect = 'SELECT * FROM pending_events WHERE pending_event_id = ?';
    db.query(sqlSelect, [pendingEventId], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).send('Pending event not found');
        }

        const pendingEvent = result[0];

        // Insert the event into the confirmed_events table
        const sqlInsert = `
            INSERT INTO confirmed_events 
            (confirmed_service_id, confirmed_event_date, confirmed_event_start, confirmed_event_end, reserving_user_id) 
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(sqlInsert, [
            pendingEvent.pending_service_id,
            pendingEvent.pending_date,
            pendingEvent.pending_start_of_event,
            pendingEvent.pending_end_of_event,
            pendingEvent.user_id
        ], (err, result) => {
            if (err) {
                console.error('Error confirming event:', err.message);
                return res.status(500).send('Error confirming event', err.message);
            }

            // Delete the event from the pending_events table
            const sqlDelete = 'DELETE FROM pending_events WHERE pending_event_id = ?';
            db.query(sqlDelete, [pendingEventId], (err) => {
                if (err) {
                    return res.status(500).send('Error deleting pending event');
                }
                res.send('Event confirmed and moved to confirmed_events');
            });
        });
    });
});

// Deny (delete) a pending event
app.delete('/api/deletePendingEvent/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM pending_events WHERE pending_event_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Event denied and deleted' });
    });
});

app.post('/api/updateConfirmedEvents', (req, res) => {
    const modifiedEvents = req.body;

    modifiedEvents.forEach(event => {
        const sql = `
        UPDATE confirmed_events 
        SET confirmed_event_date = ?, confirmed_event_start = ?, confirmed_event_end = ?
        WHERE confirmed_event_id = ?
      `;

        db.query(sql, [
            event.modifiedEventDate,
            event.newStart,
            event.newEnd,
            event.id
        ], (err, result) => {
            if (err) return res.status(500).send(err);
        });
    });

    res.send('Events updated successfully');
});

// Delete confirmed event
app.delete('/api/deleteEvent/:id', (req, res) => {
    const confirmedEventId = req.params.id;

    const sqlDelete = 'DELETE FROM confirmed_events WHERE confirmed_event_id = ?';
    db.query(sqlDelete, [confirmedEventId], (err, result) => {
        if (err) {
            console.error('Error deleting event:', err);
            return res.status(500).send('Error deleting event');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Event not found');
        }

        res.status(200).send('Event deleted successfully');
    });
});


// GET all users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// // CREATE a new user
// app.post('/api/users', (req, res) => {
//     const { firstName, lastName, role, email, phone, password } = req.body;
//     const sql = 'INSERT INTO users (firstName, lastName, role, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?, ?)';
//     db.query(sql, [firstName, lastName, role, email, phone, password], (err, result) => {
//         if (err) return res.status(500).send(err);
//         res.status(201).json({ id: result.insertId, firstName, lastName, role, email, phone });
//     });
// });

// UPDATE a user
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, role, email, phoneNumber } = req.body; // Remove password from the body
    const sql = 'UPDATE users SET firstName = ?, lastName = ?, role = ?, email = ?, phoneNumber = ? WHERE id = ?'; // No password update
    db.query(sql, [firstName, lastName, role, email, phoneNumber, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'User updated successfully' });
    });
});

// DELETE a user
app.delete('/api/users/:id', (req, res) => {
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