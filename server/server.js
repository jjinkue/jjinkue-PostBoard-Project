const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware Configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || "*",
    methods: "GET,POST,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization"
};
app.use(cors(corsOptions));
app.use(express.json());

// Route Configuration
app.use("/api/posts", require("./routes/posts"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/auth", require("./routes/auth"));

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
