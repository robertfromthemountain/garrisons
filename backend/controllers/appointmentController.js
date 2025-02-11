const db = require('../models/db');
const transporter = require('../utils/transporter'); // Ensure transporter is reusable
const { formatDate, formatTime } = require('../utils/dateFormatter');
const {
    appointmentRequestTemplate,
    appointmentConfirmationTemplate,
    appointmentDenialTemplate,
    appointmentUpdateTemplate,
    appointmentCancellationTemplate,
} = require('../mailer/templates');

exports.getEvents = (req, res) => {
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
};

exports.requestAppointment = (req, res) => {
    const { service_id, event_date, event_start, event_end, user_id } = req.body;

    // Check if required fields are provided
    if (!service_id || !event_date || !event_start || !event_end || !user_id) {
        return res.status(400).send('Missing required fields');
    }

    // Query to check the user's role
    const sqlCheckRole = 'SELECT role FROM users WHERE id = ?';
    db.query(sqlCheckRole, [user_id], (err, roleResults) => {
        if (err) {
            console.error('Database error:', err);
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
                    console.error('Database error:', err);
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
            const sqlInsert = `INSERT INTO events (service_id, event_date, event_start, event_end, user_id, status, event_classes${isAdmin ? ', confirmed_at' : ''}) 
                               VALUES (?, ?, ?, ?, ?, ?, ?${isAdmin ? ', NOW()' : ''})`;

            db.query(sqlInsert, [service_id, event_date, event_start, event_end, user_id, status, eventClass], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).send('Database error');
                }

                // Fetch user's full name
                const sqlUserSelect = 'SELECT firstName, lastName FROM users WHERE id = ?';
                db.query(sqlUserSelect, [user_id], (err, userResults) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).send('Database error');
                    }
                    if (userResults.length > 0) {
                        const user = userResults[0];
                        const fullName = `${user.firstName} ${user.lastName}`;

                        // Fetch service details from the services table
                        const sqlServiceSelect = 'SELECT title, id, duration, price FROM services WHERE id = ?';
                        db.query(sqlServiceSelect, [service_id], (err, serviceResults) => {
                            if (err) {
                                console.error('Database error:', err);
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
                                    const emailContent = appointmentRequestTemplate({
                                        fullName,
                                        service,
                                        formattedDate,
                                        formattedStartTime,
                                        formattedEndTime,
                                        eventId: result.insertId,
                                    });

                                    const mailOptions = {
                                        from: "Garrison's Haircraft And Barbershop <noreply@garrisons.com>",
                                        to: 'admin@example.com', // Admin's email address
                                        subject: 'New Appointment Request',
                                        html: emailContent,
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
};

exports.getPendingEvents = (req, res) => {
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
};

exports.confirmEvent = (req, res) => {
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

            const emailContent = appointmentConfirmationTemplate({
                userName,
                event,
                formattedDate,
                formattedStartTime,
                formattedEndTime,
            });

            const mailOptions = {
                from: "Garrison's Haircraft And Barbershop <noreply@garrisons.com>",
                to: userEmail,
                subject: 'Appointment Confirmed',
                html: emailContent,
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
};

exports.deletePendingEvent = (req, res) => {
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

        const emailContent = appointmentDenialTemplate({
            userName,
            event,
            formattedDate,
            formattedStartTime,
            formattedEndTime,
        });

        // Send the denial email
        const mailOptions = {
            from: "Garrison's Haircraft And Barbershop <noreply@garrisons.com>",
            to: userEmail,
            subject: 'Appointment Denied',
            html: emailContent,
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
};

exports.updateConfirmedEvents = async (req, res) => {
    const modifiedEvents = req.body;

    try {
        // Use Promise.all to handle all queries asynchronously
        const updatePromises = modifiedEvents.map(event => {
            return new Promise((resolve, reject) => {
                const sqlUpdate = `
                UPDATE events 
                SET event_date = ?, event_start = ?, event_end = ?
                WHERE event_id = ?
                `;

                db.query(sqlUpdate, [
                    event.modifiedEventDate,
                    event.newStart,
                    event.newEnd,
                    event.id
                ], (err) => {
                    if (err) return reject(err);

                    // Fetch event details (including email) after the event is updated
                    const sqlSelect = `
                    SELECT 
                        users.email, users.firstName, users.lastName, 
                        services.title, events.event_date, events.event_start, events.event_end
                    FROM 
                        events
                    JOIN 
                        users ON events.user_id = users.id
                    JOIN 
                        services ON events.service_id = services.id
                    WHERE 
                        events.event_id = ?
                    `;

                    db.query(sqlSelect, [event.id], (err, eventDetails) => {
                        if (err || eventDetails.length === 0) {
                            console.error("Error fetching event details or no event found.");
                            return reject('Error fetching event details.');
                        }

                        const eventData = eventDetails[0]; // The updated event data
                        const fullName = `${eventData.firstName} ${eventData.lastName}`;
                        const formattedDate = formatDate(eventData.event_date);
                        const formattedStartTime = formatTime(eventData.event_start);
                        const formattedEndTime = formatTime(eventData.event_end);

                        // Construct the email HTML content
                        const emailContent = appointmentUpdateTemplate({
                            fullName,
                            eventData,
                            formattedDate,
                            formattedStartTime,
                            formattedEndTime,
                        });

                        // Send the feedback email
                        const mailOptions = {
                            from: "Garrison's Haircraft <noreply@garrisons.com>",
                            to: eventData.email, // User's email
                            subject: 'Your Appointment has been Updated',
                            html: emailContent, // The constructed HTML email content
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
};

exports.deleteEvent = (req, res) => {
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

            const emailContent = appointmentCancellationTemplate({
                fullName,
                eventData,
                formattedDate,
                formattedStartTime,
                formattedEndTime,
            });

            // Send feedback email to the user after successful deletion
            const mailOptions = {
                from: "Garrison's Haircraft <noreply@garrisons.com>",
                to: eventData.email,
                subject: 'Your Appointment has been Cancelled',
                html: emailContent,
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
};