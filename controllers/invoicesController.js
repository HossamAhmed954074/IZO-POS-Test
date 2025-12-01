const InvoiceModel = require("../models/invoiceModel");
const SyncModel = require("../models/syncModel");
const syncWebSocket = require("../websocket/syncWebSocket");

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

    const syncTime = new Date().toISOString();
    SyncModel.addSync(syncTime);

    // Auto broadcast sync to all connected clients
    syncWebSocket.broadcastSync({
      last_sync: syncTime,
      action: "invoice_created",
      data: { customer_name, total_amount },
      message: "New invoice created",
    });

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
      const syncTime = new Date().toISOString();
      SyncModel.addSync(syncTime);

      // Auto broadcast sync to all connected clients
      syncWebSocket.broadcastSync({
        last_sync: syncTime,
        action: "invoice_updated",
        data: { id, customer_name, total_amount },
        message: "Invoice updated",
      });

      res.status(200).json({ message: "Invoice updated successfully" });
    } else {
      res.status(404).json({ message: "Invoice not found" });
    }
  }

  // delete invoice
  static deleteInvoice(req, res) {
    const { id } = req.params;
    const changes = InvoiceModel.deleteInvoice(id);
    if (changes > 0) {
      const syncTime = new Date().toISOString();
      SyncModel.addSync(syncTime);
      // Auto broadcast sync to all connected clients
      syncWebSocket.broadcastSync({
        last_sync: syncTime,
        action: "invoice_deleted",
        data: { id },
        message: "Invoice deleted",
      });
      res.status(200).json({ message: "Invoice deleted successfully" });
    } else {
      res.status(404).json({ message: "Invoice not found" });
    }
  }

  // delete all invoices (for testing purposes)
  static deleteAllInvoices(req, res) {
    InvoiceModel.deleteAllInvoices();
    const syncTime = new Date().toISOString();
    SyncModel.addSync(syncTime);
    // Auto broadcast sync to all connected clients
    syncWebSocket.broadcastSync({
      last_sync: syncTime,
      action: "all_invoices_deleted",
      data: {},
      message: "All invoices deleted",
    });
    res.status(200).json({ message: "All invoices deleted successfully" });
  }
}

module.exports = InvoicesController;
