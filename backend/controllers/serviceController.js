const db = require('../models/db');

exports.getAllServices = (req, res) => {
    db.query('SELECT * FROM services', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
};

exports.createService = (req, res) => {
    const { title, price, duration, backgroundColor } = req.body;
    const sql = 'INSERT INTO services (title, price, duration, backgroundColor) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, price, duration, backgroundColor || '#8f6a48'], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.status(201).json({ id: result.insertId, title, price, duration, backgroundColor });
    });
};

exports.updateService = (req, res) => {
    const { id } = req.params;
    const { title, price, duration, backgroundColor } = req.body;
    const sql = 'UPDATE services SET title = ?, price = ?, duration = ?, backgroundColor = ? WHERE id = ?';
    db.query(sql, [title, price, duration, backgroundColor || '#8f6a48', id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Service updated successfully' });
    });
};

exports.deleteService = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM services WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Service deleted successfully' });
    });
};
