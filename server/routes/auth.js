const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET
const SALT_ROUNDS = 10;

// Update passwords for existing users if they are not hashed
async function updatePasswords() {
    const [users] = await pool.query("SELECT id, password FROM users");

    for (let user of users) {
        if (!user.password.startsWith("$2b$")) { // Check if password is already hashed
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id]);
            console.log(`✅ Updated password for user ID: ${user.id}`);
        }
    }
}

updatePasswords();

// Login API
router.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Login failed: Invalid username or password." });
        }

        const user = rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Login failed: Invalid username or password." });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful!", token, username: user.username });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Registration API
router.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check for duplicate username
        const [existingUsers] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "This username is already taken." });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await pool.query(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashedPassword]
        );

        res.status(201).json({ message: "Registration successful!", userId: result.insertId });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
