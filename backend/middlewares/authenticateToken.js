const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No token provided or invalid format");
        return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                console.log("Token expired:", err.message);
                return res.status(403).json({ message: "Token expired" });
            } else {
                console.log("Token verification failed:", err.message);
                return res.status(403).json({ message: "Invalid token" });
            }
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            phoneNumber: decoded.phoneNumber,
        };

        console.log("Token successfully decoded. User:", req.user);
        next();
    });
}

module.exports = authenticateToken;
