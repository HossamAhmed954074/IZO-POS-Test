const db = require('../database/db');


class InvoiceModel {

    constructor() {
        this.initializeTables();
    }

    // initialize
    initializeTables() {
        InvoiceModel.createTable();
    }

  // Create table
  static createTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT NOT NULL,
                total_amount REAL NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime')) 
            )
        `;
    db.prepare(query).run();
  }
    // Add invoice
    static addInvoice(customer_name, total_amount, created_at, updated_at) {
        
        const query = `
            INSERT INTO invoices (customer_name, total_amount, created_at, updated_at)
            VALUES (?, ?, ?, ?)
        `;
        db.prepare(query).run(customer_name, total_amount, created_at, updated_at);
    }
    // Get all invoices
    static getAllInvoices() {
        const query = `
            SELECT * FROM invoices
        `;
        return db.prepare(query).all();
    }
    // Get invoice by id
    static getInvoiceById(id) {
        const query = `
            SELECT * FROM invoices WHERE id = ?
        `;
        return db.prepare(query).get(id);
    }
    // Update invoice
    static updateInvoice(id, customer_name, total_amount, updated_at) {
        const query = `
            UPDATE invoices
            SET customer_name = ?, total_amount = ?, updated_at = ?
            WHERE id = ?
        `;
        const stmt = db.prepare(query);
        const info = stmt.run(customer_name, total_amount, updated_at, id);
        return info.changes;
    }
    // Delete invoice
    static deleteInvoice(id) {
        const query = `
            DELETE FROM invoices WHERE id = ?
        `;
        const stmt = db.prepare(query);
        const info = stmt.run(id);
        return info.changes;
    }

    // delete all invoices (for testing purposes)
    static deleteAllInvoices() {
        const query = `
            DELETE FROM invoices
        `;
        db.prepare(query).run();
    }
}

module.exports = InvoiceModel;