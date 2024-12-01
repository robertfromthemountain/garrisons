const db = require('../models/db');

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

module.exports = isAdmin;