const pool = require("../config/database");

/**
 * Payments now belong to a bill (bill_id).
 * tenant_id and room_id are derived through the bill → assignment → room/tenant chain.
 * One bill can have multiple partial payments.
 */

const getPayments = async () => {
    const [result] = await pool.query(`
        SELECT
            p.payment_id,
            p.bill_id,
            p.amount,
            p.payment_method,
            p.payment_date,
            p.proof_image,
            p.remarks,
            p.created_at,

            b.bill_month,
            b.total_amount AS bill_total,

            r.room_number,
            t.fullname AS tenant_name

        FROM payments p
        JOIN bills b ON p.bill_id = b.bill_id
        JOIN room_assignments ra ON b.assignment_id = ra.assignment_id
        JOIN rooms r ON ra.room_id = r.room_id
        JOIN tenants t ON ra.tenant_id = t.tenant_id
        ORDER BY p.payment_date DESC
    `);

    return result;
};

const getPaymentByID = async (id) => {
    const [result] = await pool.query(`
        SELECT
            p.payment_id,
            p.bill_id,
            p.amount,
            p.payment_method,
            p.payment_date,
            p.proof_image,
            p.remarks,
            p.created_at,

            b.bill_month,
            b.total_amount AS bill_total,

            r.room_number,
            t.fullname AS tenant_name

        FROM payments p
        JOIN bills b ON p.bill_id = b.bill_id
        JOIN room_assignments ra ON b.assignment_id = ra.assignment_id
        JOIN rooms r ON ra.room_id = r.room_id
        JOIN tenants t ON ra.tenant_id = t.tenant_id
        WHERE p.payment_id = ?
    `, [id]);

    return result[0];
};

const getPaymentsByBill = async (bill_id) => {
    const [result] = await pool.query(`
        SELECT
            payment_id,
            bill_id,
            amount,
            payment_method,
            payment_date,
            proof_image,
            remarks,
            created_at
        FROM payments
        WHERE bill_id = ?
        ORDER BY payment_date ASC
    `, [bill_id]);

    return result;
};

const createPayment = async (body) => {
    const {
        bill_id,
        amount,
        payment_method,
        payment_date,
        proof_image,
        remarks
    } = body;

    const [result] = await pool.query(`
        INSERT INTO payments (bill_id, amount, payment_method, payment_date, proof_image, remarks)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        bill_id,
        amount,
        payment_method || "Cash",
        payment_date || new Date(),
        proof_image || null,
        remarks || null
    ]);

    return result;
};

const updatePayment = async (id, body) => {
    const {
        amount,
        payment_method,
        payment_date,
        proof_image,
        remarks
    } = body;

    const [result] = await pool.query(`
        UPDATE payments
        SET
            amount = ?,
            payment_method = ?,
            payment_date = ?,
            proof_image = ?,
            remarks = ?
        WHERE payment_id = ?
    `, [
        amount,
        payment_method,
        payment_date,
        proof_image,
        remarks,
        id
    ]);

    return result;
};

const deletePayment = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM payments WHERE payment_id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getPayments,
    getPaymentByID,
    getPaymentsByBill,
    createPayment,
    updatePayment,
    deletePayment
};