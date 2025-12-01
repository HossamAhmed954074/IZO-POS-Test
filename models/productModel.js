const db = require("../database/db");

class ProductModel {
  //create table
  static createTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                stock INTEGER NOT NULL
            )
        `;
    db.prepare(query).run();
  }
  //add product
  static addProduct(name, price, stock) {
    const query = `
            INSERT INTO products (name, price, stock)
            VALUES (?, ?, ?)
        `;
    const stmt = db.prepare(query);
    const info = stmt.run(name, price, stock);
    return info.lastInsertRowid;
  }
  //get all products
  static getAllProducts() {
    const query = `
            SELECT * FROM products
        `;
    const stmt = db.prepare(query);
    return stmt.all();
  }
  //get product by id
  static getProductById(id) {
    const query = `
            SELECT * FROM products WHERE id = ?
        `;
    const stmt = db.prepare(query);
    return stmt.get(id);
  }
  //update product
  static updateProduct(id, name, price, stock) {
    const query = `
            UPDATE products
            SET name = ?, price = ?, stock = ?
            WHERE id = ?
        `;
    const stmt = db.prepare(query);
    const info = stmt.run(name, price, stock, id);
    return info.changes;
  }
  //delete product
  static deleteProduct(id) {
    const query = `
            DELETE FROM products WHERE id = ?
        `;
    const stmt = db.prepare(query);
    const info = stmt.run(id);
    return info.changes;
  }
}

module.exports = ProductModel;
