const InvoicesController = require("../controllers/invoicesController");
const express = require("express");
const router = express.Router();
// create invoice
router.post("/", InvoicesController.createInvoice);
// get all invoices
router.get("/", InvoicesController.getAllInvoices);
// get invoice by id
router.get("/:id", InvoicesController.getInvoiceById);
// update invoice
router.put("/:id", InvoicesController.updateInvoice);
// delete invoice
router.delete("/:id", InvoicesController.deleteInvoice);

// delete all invoices (for testing purposes)
router.delete("/", InvoicesController.deleteAllInvoices);

module.exports = router;
