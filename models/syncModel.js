const db = require('../database/db');
class SyncModel {

    constructor() {
        this.initializeTables();
    }
    // initialize
    initializeTables() {
        SyncModel.createTable();
    }
    // Create table
    static createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS sync (
                id INTEGER PRIMARY KEY AUTOINCREMENT,            
                last_sync TEXT NOT NULL 
            )
        `;
        db.prepare(query).run();
    }
    // Add sync record
    static addSync(last_sync) {
        const query = `
            INSERT INTO sync (last_sync)
            VALUES (?)
        `;
        db.prepare(query).run(last_sync);
    }
    // Get last sync
    static getLastSync() {
        const query = `
            SELECT * FROM sync ORDER BY id DESC LIMIT 1
        `;
        return db.prepare(query).get();
    }
}


module.exports = SyncModel;