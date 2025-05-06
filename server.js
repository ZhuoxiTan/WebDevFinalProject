"use strict"
const express = require("express");

const app = express();
const port = 3000;
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

// Serve static files from root directory
app.use(express.static(__dirname));

// Add middleware to parse JSON requests
app.use(express.json());

async function getDBConnection() {
    const db = await sqlite.open({
        filename: "./results.db", 
        driver: sqlite3.Database,
    });
    return db;
}

// Endpoint to get leaderboard data
app.get("/lb", async (req, res) => {
    try {
        let db = await getDBConnection();
        const sqlString = "SELECT * FROM results ORDER BY Score DESC LIMIT 5";
        let rows = await db.all(sqlString);
        await db.close();
        res.json(rows);
    } catch (error) {
        console.error("Error retrieving leaderboard:", error);
        res.status(500).json({ error: "Failed to retrieve leaderboard data" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Visit http://localhost:${port}/leaderboard.html`);
});