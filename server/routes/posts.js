const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("./authMiddleware");

// Get all posts
router.get("/", authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT posts.id, posts.title, posts.content, users.username AS author, posts.view_count, posts.created_at,
            DATE_FORMAT(posts.created_at, '%Y-%m-%d') AS formatted_date
            FROM posts
            JOIN users ON posts.author_id = users.id
            ORDER BY posts.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Create a new post
router.post("/", async (req, res) => {
    const { title, content, username } = req.body;

    try {
        const [userRows] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        const author_id = userRows[0].id;
        const [result] = await pool.query(
            "INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)",
            [title, content, author_id]
        );
        res.status(201).json({ message: "Post created successfully!", postId: result.insertId });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get a single post by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        console.log(`📌 [Fetch post request] post_id: ${id}`);

        // Check if post exists
        const [rows] = await pool.query(`
            SELECT posts.id, posts.title, posts.content, users.username AS author, posts.view_count, posts.created_at,
            DATE_FORMAT(posts.created_at, '%Y-%m-%d') AS formatted_date
            FROM posts
            JOIN users ON posts.author_id = users.id
            WHERE posts.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Post not found." }); // If no post found, return 404
        }

        res.json(rows[0]); // Return the post details
    } catch (error) {
        console.error("❌ Error fetching post:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Increase post view count
router.patch("/:id/view", async (req, res) => {
    const { id } = req.params;

    try {
        console.log(`📌 [View count request] post_id: ${id}`);
        const [result] = await pool.query("UPDATE posts SET view_count = view_count + 1 WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found." });
        }

        res.json({ message: "View count updated successfully!" });
    } catch (error) {
        console.error("Error updating view count:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
