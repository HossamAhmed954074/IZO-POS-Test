const InvoiceModel = require("../models/invoiceModel");
const SyncModel = require("../models/syncModel");

class InvoicesController {
  // create invoice
  static createInvoice(req, res) {
    const {
      customer_name,
      total_amount,
      created_at = new Date().toISOString(),
      updated_at = new Date().toISOString(),
    } = req.body;
    InvoiceModel.addInvoice(
      customer_name,
      total_amount,
      created_at,
      updated_at
    );
    SyncModel.addSync(new Date().toISOString());
    res.status(201).json({ message: "Invoice created successfully" });
  }
  // get all invoices
  static getAllInvoices(req, res) {
    const invoices = InvoiceModel.getAllInvoices();
    res.status(200).json(invoices);
  }
  // get invoice by id
  static getInvoiceById(req, res) {
    const { id } = req.params;
    const invoice = InvoiceModel.getInvoiceById(id);
    if (invoice) {
      res.status(200).json(invoice);
    } else {
      res.status(404).json({ message: "Invoice not found" });
    }
  }
  // update invoice
  static updateInvoice(req, res) {
    const { id } = req.params;
    const {
      customer_name,
      total_amount,
      updated_at = new Date().toISOString(),
    } = req.body;
    const changes = InvoiceModel.updateInvoice(
      id,
      customer_name,
      total_amount,
      updated_at
    );
    if (changes > 0) {
      SyncModel.addSync(new Date().toISOString());
      res.status(200).json({ message: "Invoice updated successfully" });
    } else {
      res.status(404).json({ message: "Invoice not found" });
    }
  }
}

module.exports = InvoicesController;
