const pool = require("../config/database");

const getBills = async () => {
    const [result] = await pool.query(`
        SELECT
            b.bill_id,
            b.assignment_id,
            b.bill_month,
            b.room_rent,
            b.other_fee,
            b.total_amount,
            b.status,
            b.due_date,
            b.created_at,

            r.room_number,
            t.fullname AS tenant_name,
            t.tenant_id,

            COALESCE(SUM(p.amount), 0) AS total_paid,
            (b.total_amount - COALESCE(SUM(p.amount), 0)) AS balance

        FROM bills b
        JOIN room_assignments ra ON b.assignment_id = ra.assignment_id
        JOIN rooms r ON ra.room_id = r.room_id
        JOIN tenants t ON ra.tenant_id = t.tenant_id
        LEFT JOIN payments p ON b.bill_id = p.bill_id
        GROUP BY b.bill_id
        ORDER BY b.bill_month DESC
    `);

    return result;
};

const getBillByID = async (id) => {
    const [result] = await pool.query(`
        SELECT
            b.bill_id,
            b.assignment_id,
            b.bill_month,
            b.room_rent,
            b.other_fee,
            b.total_amount,
            b.status,
            b.due_date,
            b.created_at,

            r.room_id,
            r.room_number,
            t.tenant_id,
            t.fullname AS tenant_name,
            t.phone

        FROM bills b
        JOIN room_assignments ra ON b.assignment_id = ra.assignment_id
        JOIN rooms r ON ra.room_id = r.room_id
        JOIN tenants t ON ra.tenant_id = t.tenant_id
        WHERE b.bill_id = ?
    `, [id]);

    return result[0];
};

const getBillsByAssignment = async (assignment_id) => {
    const [result] = await pool.query(`
        SELECT * FROM bills
        WHERE assignment_id = ?
        ORDER BY bill_month DESC
    `, [assignment_id]);

    return result;
};

/**
 * Creates a bill and auto-calculates total_amount from bill_details.
 * Call this after inserting bill_details.
 */
const createBill = async (body) => {
    const {
        assignment_id,
        bill_month,
        room_rent,
        other_fee,
        due_date,
        status
    } = body;

    const [result] = await pool.query(`
        INSERT INTO bills (assignment_id, bill_month, room_rent, other_fee, due_date, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        assignment_id,
        bill_month,
        room_rent,
        other_fee || 0,
        due_date || null,
        status || "Draft"
    ]);

    return result;
};

/**
 * Recalculates and updates total_amount = room_rent + sum(bill_details) + other_fee
 */
const recalculateBillTotal = async (bill_id) => {
    const [rows] = await pool.query(`
        SELECT
            b.room_rent,
            b.other_fee,
            COALESCE(SUM(bd.total_price), 0) AS details_total
        FROM bills b
        LEFT JOIN bill_details bd ON b.bill_id = bd.bill_id
        WHERE b.bill_id = ?
        GROUP BY b.bill_id
    `, [bill_id]);

    const totals = rows[0] || { room_rent: 0, other_fee: 0, details_total: 0 };
    const total_amount = Number(totals.room_rent || 0) + Number(totals.other_fee || 0) + Number(totals.details_total || 0);

    const [result] = await pool.query(
        `UPDATE bills SET total_amount = ? WHERE bill_id = ?`,
        [total_amount, bill_id]
    );

    return result;
};

/**
 * Updates bill status based on payments made.
 * Call after every payment insert/update/delete.
 */
const updateBillStatus = async (bill_id) => {
    const [rows] = await pool.query(`
        SELECT
            b.total_amount,
            COALESCE(SUM(p.amount), 0) AS total_paid
        FROM bills b
        LEFT JOIN payments p ON b.bill_id = p.bill_id
        WHERE b.bill_id = ?
        GROUP BY b.bill_id
    `, [bill_id]);

    if (!rows[0]) return;

    const { total_amount, total_paid } = rows[0];
    let status;

    if (total_paid <= 0) {
        status = "Unpaid";
    } else if (total_paid < total_amount) {
        status = "Partially Paid";
    } else {
        status = "Paid";
    }

    await pool.query(
        "UPDATE bills SET status = ? WHERE bill_id = ?",
        [status, bill_id]
    );
};

const updateBill = async (id, body) => {
    const {
        room_rent,
        other_fee,
        due_date,
        status
    } = body;

    const [result] = await pool.query(`
        UPDATE bills
        SET room_rent = ?, other_fee = ?, due_date = ?, status = ?
        WHERE bill_id = ?
    `, [room_rent, other_fee, due_date, status, id]);

    return result;
};

const deleteBill = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM bills WHERE bill_id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getBills,
    getBillByID,
    getBillsByAssignment,
    createBill,
    recalculateBillTotal,
    updateBillStatus,
    updateBill,
    deleteBill
};