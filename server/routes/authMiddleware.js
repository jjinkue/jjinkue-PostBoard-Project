const jwt = require("jsonwebtoken");

// Middleware to check if the user is authenticated
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token." });

        req.user = user; // Attach the user info to the request
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;
