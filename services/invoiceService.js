const invoiceModel = require("../models/Invoicemodel");
const billModel = require("../models/Billmodel");

const getInvoices = async () => {
    return await invoiceModel.getInvoices();
};

const getInvoiceByID = async (id) => {
    if (!id) throw new Error("Invoice ID is required");

    const data = await invoiceModel.getInvoiceByID(id);
    if (!data) throw new Error("Invoice not found");

    return data;
};

/**
 * Returns invoice + utility line items + payment history in one response.
 * Use this for rendering a printable invoice.
 */
const getInvoiceFullDetail = async (id) => {
    if (!id) throw new Error("Invoice ID is required");

    const data = await invoiceModel.getInvoiceFullDetail(id);
    if (!data) throw new Error("Invoice not found");

    return data;
};

/**
 * Auto-generates an invoice number if not provided: INV-{year}{month}-{bill_id}
 */
const createInvoice = async (body) => {
    const { bill_id, issue_date } = body;

    if (!bill_id) throw new Error("bill_id is required");

    const bill = await billModel.getBillByID(bill_id);
    if (!bill) throw new Error("Bill not found");

    // One invoice per bill — enforce uniqueness at service level
    const existing = await invoiceModel.getInvoices();
    const duplicate = existing.find((inv) => inv.bill_id === parseInt(bill_id));
    if (duplicate) {
        throw new Error("An invoice already exists for this bill");
    }

    // Auto-generate invoice number if not supplied
    let invoice_number = body.invoice_number;
    if (!invoice_number) {
        const d = new Date(bill.bill_month);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        invoice_number = `INV-${year}${month}-${bill_id}`;
    }

    if (!invoice_number.startsWith("INV")) {
        throw new Error("Invoice number must start with INV");
    }

    const result = await invoiceModel.createInvoice({
        bill_id,
        invoice_number,
        issue_date: issue_date || new Date()
    });

    if (!result.insertId) throw new Error("Failed to create invoice");

    return await invoiceModel.getInvoiceByID(result.insertId);
};

const updateInvoice = async (id, body) => {
    if (!id) throw new Error("Invoice ID is required");

    const existing = await invoiceModel.getInvoiceByID(id);
    if (!existing) throw new Error("Invoice not found");

    const { invoice_number, issue_date } = body;

    if (invoice_number && !invoice_number.startsWith("INV")) {
        throw new Error("Invoice number must start with INV");
    }

    const result = await invoiceModel.updateInvoice(id, {
        invoice_number: invoice_number || existing.invoice_number,
        issue_date: issue_date || existing.issue_date
    });

    if (result.affectedRows === 0) throw new Error("Update failed");

    return await invoiceModel.getInvoiceByID(id);
};

const deleteInvoice = async (id) => {
    if (!id) throw new Error("Invoice ID is required");

    const existing = await invoiceModel.getInvoiceByID(id);
    if (!existing) throw new Error("Invoice not found");

    return await invoiceModel.deleteInvoice(id);
};

module.exports = {
    getInvoices,
    getInvoiceByID,
    getInvoiceFullDetail,
    createInvoice,
    updateInvoice,
    deleteInvoice
};