const jwt = require('jsonwebtoken');

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

module.exports = authenticateToken;