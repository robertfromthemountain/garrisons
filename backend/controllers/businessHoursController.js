const db = require('../models/db');

// Get all business hours
exports.getBusinessHours = (req, res) => {
    const query = `
        SELECT 
            id, 
            daysOfWeek, 
            DATE_FORMAT(startTime, '%H:%i') AS startTime, 
            DATE_FORMAT(endTime, '%H:%i') AS endTime 
        FROM business_hours
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching business hours:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
};

// Update business hours for a specific day
exports.updateBusinessHours = (req, res) => {
    const { startTime, endTime } = req.body;
    const { id } = req.params;

    const sql = 'UPDATE business_hours SET startTime = ?, endTime = ? WHERE id = ?';
    db.query(sql, [startTime, endTime, id], (err, result) => {
        if (err) {
            console.error('Error updating business hours:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: 'Business hours updated successfully' });
    });
};
