require("dotenv").config({ path: __dirname + "/.env" });
const mysql = require("mysql2/promise");

// MySQL Connection Pool Configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;

// MySQL Connection Test
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Successfully connected to MySQL database!");
        connection.release();
    } catch (err) {
        console.error("❌ Failed to connect to MySQL:", err);
    }
})();
