const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

// Registration endpoint
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    try {
        // Check if email already exists in the database:
        const emailCheckQuery = 'SELECT * from users WHERE email = ?';
        db.query(emailCheckQuery, [email], async (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
                return;
            }
            if (results.length > 0) {
                res.status(400).send('Email was already registered to the database!');
                return;
            }
        })
        const hashedPassword = await bcrypt.hash(password, 10); // salt rounds = 10
        const sqlInsert = `INSERT INTO users (firstName, lastName, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?)`;
        db.query(sqlInsert, [firstName, lastName, email, phoneNumber, hashedPassword], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
                return;
            }
            res.status(201).send('User registered');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
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
    const sqlQuery = 'SELECT * FROM confirmed_events';
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).send('Error fetching events');
        }

        // Ensure results is an array before mapping
        if (Array.isArray(results)) {
            const fullCalendarEvents = results.map(event => ({
                id: event.confirmed_event_id,
                title: event.confirmed_event_title,
                start: event.confirmed_event_start,
                end: event.confirmed_event_end,
                reserving_user_id: event.reserving_user_id,
                confirmed_event_date: event.confirmed_event_date,
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
    const { pending_service_title, pending_date, pending_start_of_event, pending_end_of_event, user_id } = req.body;

    // Check if required fields are provided
    if (!pending_service_title || !pending_date || !pending_start_of_event || !pending_end_of_event || !user_id) {
        return res.status(400).send('Missing required fields');
    }

    const sqlInsert = `INSERT INTO pending_events (pending_service_title, pending_date, pending_start_of_event, pending_end_of_event, user_id) VALUES (?, ?, ?, ?, ?)`;
    db.query(sqlInsert, [pending_service_title, pending_date, pending_start_of_event, pending_end_of_event, user_id], (err, result) => {
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

                            <p style="color: #0c0a09;"><strong>Service:</strong> ${pending_service_title}</p>
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

                res.status(201).json({ id: result.insertId, pending_service_title, pending_date, pending_start_of_event, pending_end_of_event, user_id });
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

// Confirm a pending event:
app.get('/api/confirmEvent/:id', (req, res) => {
    const pendingEventId = req.params.id;
    console.log('Pending event id-je:', pendingEventId);

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
            (confirmed_event_title, confirmed_event_date, confirmed_event_start, confirmed_event_end, reserving_user_id) 
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(sqlInsert, [
            pendingEvent.pending_service_title,
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