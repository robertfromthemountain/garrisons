const db = require('../models/db');

exports.getAllUsers = (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, role, email, phoneNumber, status } = req.body;

    const sql = 'UPDATE users SET firstName = ?, lastName = ?, role = ?, email = ?, phoneNumber = ?, status = ? WHERE id = ?';
    db.query(sql, [firstName, lastName, role, email, phoneNumber, status, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'User updated successfully' });
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'User deleted successfully' });
    });
};

exports.loggedInUser = (req, res) => {
    const userId = req.user.userId; // Access user ID from decoded token
    const email = req.user.email;
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;
    const phoneNumber = req.user.phoneNumber;

    res.json({ userId, email, firstName, lastName, phoneNumber });
};