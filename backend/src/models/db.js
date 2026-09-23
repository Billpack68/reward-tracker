const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create or connect to database
const db = new sqlite3.Database('./habit-tracker.db');

// Initialize tables
db.serialize(() => {
  // Create rewards table
  db.run(`CREATE TABLE IF NOT EXISTS rewards (
    id INTEGER PRIMARY KEY,
    points INTEGER DEFAULT 0
  )`);
  
  // Create habits table
  db.run(`CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    value NUMBER,
    max_completions_per_day NUMBER,
    completed_today NUMBER 
  )`);
  
  // Create completions table
  db.run(`CREATE TABLE IF NOT EXISTS completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER,
    completed_date DATE,
    completed_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    previous_rewards NUMBER,
    new_rewards NUMBER,
    FOREIGN KEY (habit_id) REFERENCES habits (id)
  )`);
});

module.exports = db;