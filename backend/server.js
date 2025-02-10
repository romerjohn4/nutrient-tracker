const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Create a MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "applejuiceisgood1234$",
    database: process.env.DB_NAME || "nutrient_checker",
});

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log("MySQL connected...");
});

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Nutrient Tracker API");
});

// API endpoint to fetch all nutrients
app.get("/api/nutrients", (req, res) => {
    const sql = "SELECT * FROM nutrients";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// API endpoint to add a new nutrient
app.post("/api/nutrients", (req, res) => {
    const { name, calories, protein, carbs, fats } = req.body;
    const sql = "INSERT INTO nutrients (name, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, calories, protein, carbs, fats], (err, result) => {
        if (err) {
            console.error("Error adding nutrient:", err);
            return res.status(500).send("Error adding nutrient to the database.");
        }
        res.send({ id: result.insertId, name, calories, protein, carbs, fats });
    });
});

// API endpoint to clear all nutrients
app.delete("/api/nutrients", (req, res) => {
    const sql = "DELETE FROM nutrients";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error clearing nutrients:", err);
            return res.status(500).send("Error clearing nutrients from the database.");
        }
        res.send({ message: "All nutrients cleared successfully." });
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
