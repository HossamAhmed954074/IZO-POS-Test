const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, 'app.db');
const db = new Database(dbPath);

// Enable foreign key constraints
db.pragma('foreign_keys = ON');
// Export the database connection
module.exports = db;








