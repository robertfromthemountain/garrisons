const jwt = require('jsonwebtoken');
const db=require('../database/database');

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

module.exports = { authenticateToken, isAdmin };