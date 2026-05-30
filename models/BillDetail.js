const pool = require("../config/database");

/**
 * Get all details for a specific bill, joined with utility type info.
 */
const getBillDetails = async (bill_id) => {
    const [result] = await pool.query(`
        SELECT
            bd.detail_id,
            bd.bill_id,
            bd.utility_type_id,
            ut.utility_name,
            ut.billing_type,
            ut.unit,
            bd.old_reading,
            bd.new_reading,
            bd.quantity,
            bd.unit_price,
            bd.total_price,
            bd.notes
        FROM bill_details bd
        JOIN utility_types ut ON bd.utility_type_id = ut.utility_type_id
        WHERE bd.bill_id = ?
        ORDER BY bd.detail_id ASC
    `, [bill_id]);

    return result;
};

const getBillDetailByID = async (id) => {
    const [result] = await pool.query(`
        SELECT
            bd.detail_id,
            bd.bill_id,
            bd.utility_type_id,
            ut.utility_name,
            ut.billing_type,
            ut.unit,
            bd.old_reading,
            bd.new_reading,
            bd.quantity,
            bd.unit_price,
            bd.total_price,
            bd.notes
        FROM bill_details bd
        JOIN utility_types ut ON bd.utility_type_id = ut.utility_type_id
        WHERE bd.detail_id = ?
    `, [id]);

    return result[0];
};

/**
 * Add a utility line to a bill.
 * For meter-based (Electricity, Water): provide old_reading & new_reading; quantity = new - old.
 * For fixed (Internet, Garbage, Parking): quantity = 1, no readings needed.
 */
const createBillDetail = async (body) => {
    const {
        bill_id,
        utility_type_id,
        old_reading,
        new_reading,
        quantity,
        unit_price,
        total_price,
        notes
    } = body;

    const [result] = await pool.query(`
        INSERT INTO bill_details
            (bill_id, utility_type_id, old_reading, new_reading, quantity, unit_price, total_price, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        bill_id,
        utility_type_id,
        old_reading || null,
        new_reading || null,
        quantity,
        unit_price,
        total_price,
        notes || null
    ]);

    return result;
};

const updateBillDetail = async (id, body) => {
    const {
        old_reading,
        new_reading,
        quantity,
        unit_price,
        total_price,
        notes
    } = body;

    const [result] = await pool.query(`
        UPDATE bill_details
        SET
            old_reading = ?,
            new_reading = ?,
            quantity = ?,
            unit_price = ?,
            total_price = ?,
            notes = ?
        WHERE detail_id = ?
    `, [
        old_reading || null,
        new_reading || null,
        quantity,
        unit_price,
        total_price,
        notes || null,
        id
    ]);

    return result;
};

const deleteBillDetail = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM bill_details WHERE detail_id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getBillDetails,
    getBillDetailByID,
    createBillDetail,
    updateBillDetail,
    deleteBillDetail
};