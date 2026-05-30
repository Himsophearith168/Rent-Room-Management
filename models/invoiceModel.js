const pool = require("../config/database");

/**
 * Invoices belong to a bill (one invoice per bill).
 * Full invoice details are assembled from: bills → bill_details → payments.
 */

const getInvoices = async () => {
    const [result] = await pool.query(`
        SELECT
            i.invoice_id,
            i.bill_id,
            i.invoice_number,
            i.issue_date,
            i.created_at,

            b.bill_month,
            b.room_rent,
            b.other_fee,
            b.total_amount,
            b.status AS bill_status,
            b.due_date,

            r.room_number,
            t.fullname AS tenant_name

        FROM invoices i
        JOIN bills b ON i.bill_id = b.bill_id
        JOIN room_assignments ra ON b.assignment_id = ra.assignment_id
        JOIN rooms r ON ra.room_id = r.room_id
        JOIN tenants t ON ra.tenant_id = t.tenant_id
        ORDER BY i.issue_date DESC
    `);

    return result;
};

const getInvoiceByID = async (id) => {
    const [result] = await pool.query(`
        SELECT
            i.invoice_id,
            i.bill_id,
            i.invoice_number,
            i.issue_date,
            i.created_at,

            b.bill_month,
            b.room_rent,
            b.other_fee,
            b.total_amount,
            b.status AS bill_status,
            b.due_date,

            r.room_number,
            t.fullname AS tenant_name,
            t.phone

        FROM invoices i
        JOIN bills b ON i.bill_id = b.bill_id
        JOIN room_assignments ra ON b.assignment_id = ra.assignment_id
        JOIN rooms r ON ra.room_id = r.room_id
        JOIN tenants t ON ra.tenant_id = t.tenant_id
        WHERE i.invoice_id = ?
    `, [id]);

    return result[0];
};

/**
 * Full invoice view with bill details (utility line items) and payment history.
 */
const getInvoiceFullDetail = async (id) => {
    const invoice = await getInvoiceByID(id);
    if (!invoice) return null;

    const [details] = await pool.query(`
        SELECT
            ut.utility_name,
            ut.billing_type,
            ut.unit,
            bd.old_reading,
            bd.new_reading,
            bd.quantity,
            bd.unit_price,
            bd.total_price
        FROM bill_details bd
        JOIN utility_types ut ON bd.utility_type_id = ut.utility_type_id
        WHERE bd.bill_id = ?
        ORDER BY bd.detail_id ASC
    `, [invoice.bill_id]);

    const [payments] = await pool.query(`
        SELECT amount, payment_method, payment_date
        FROM payments
        WHERE bill_id = ?
        ORDER BY payment_date ASC
    `, [invoice.bill_id]);

    return {
        ...invoice,
        details,
        payments
    };
};

const createInvoice = async (body) => {
    const {
        bill_id,
        invoice_number,
        issue_date
    } = body;

    const [result] = await pool.query(`
        INSERT INTO invoices (bill_id, invoice_number, issue_date)
        VALUES (?, ?, ?)
    `, [
        bill_id,
        invoice_number,
        issue_date || new Date()
    ]);

    return result;
};

const updateInvoice = async (id, body) => {
    const { invoice_number, issue_date } = body;

    const [result] = await pool.query(`
        UPDATE invoices
        SET invoice_number = ?, issue_date = ?
        WHERE invoice_id = ?
    `, [invoice_number, issue_date, id]);

    return result;
};

const deleteInvoice = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM invoices WHERE invoice_id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getInvoices,
    getInvoiceByID,
    getInvoiceFullDetail,
    createInvoice,
    updateInvoice,
    deleteInvoice
};