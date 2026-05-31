const express = require("express");
const router = express.Router();

const invoice = require("../controller/invoiceController");

router.get("/", invoice.getInvoices);
router.get("/:id", invoice.getInvoiceByID);
router.get("/:id/full", invoice.getInvoiceFullDetail);
router.post("/", invoice.createInvoice);
router.put("/:id", invoice.updateInvoice);
router.delete("/:id", invoice.deleteInvoice);

module.exports = router;