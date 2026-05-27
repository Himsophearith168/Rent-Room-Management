// models/utilityBill.model.js

const db = require("../config/database");

const getAllUtilityBills = async () => {
    const [rows] = await db.query(`
        SELECT
            ub.bill_id,
            ub.room_id,
            r.room_number,

            ub.tenant_id,
            t.fullname AS tenant_name,

            ub.month,

            ub.electricity_old_reading,
            ub.electricity_new_reading,
            ub.electricity_usage,
            ub.electricity_price,
            ub.electricity_total,

            ub.water_old_reading,
            ub.water_new_reading,
            ub.water_usage,
            ub.water_price,
            ub.water_total,

            ub.garbage_fee,
            ub.total_amount,

            ub.status,
            ub.created_at

        FROM utility_bills ub

        JOIN rooms r
        ON ub.room_id = r.room_id

        JOIN tenants t
        ON ub.tenant_id = t.tenant_id

        ORDER BY ub.bill_id DESC
    `);

    return rows;
};


const getUtilityBillById = async (bill_id) => {
    const [rows] = await db.query(`
        SELECT
            ub.bill_id,
            ub.room_id,
            r.room_number,

            ub.tenant_id,
            t.fullname AS tenant_name,

            ub.month,

            ub.electricity_old_reading,
            ub.electricity_new_reading,
            ub.electricity_usage,
            ub.electricity_price,
            ub.electricity_total,

            ub.water_old_reading,
            ub.water_new_reading,
            ub.water_usage,
            ub.water_price,
            ub.water_total,

            ub.garbage_fee,
            ub.total_amount,

            ub.status,
            ub.created_at

        FROM utility_bills ub

        JOIN rooms r
        ON ub.room_id = r.room_id

        JOIN tenants t
        ON ub.tenant_id = t.tenant_id

        WHERE ub.bill_id = ?
    `, [bill_id]);

    return rows[0];
};

const createUtilityBill = async (data) => {
    const {
        room_id,
        tenant_id,
        month,

        electricity_old_reading,
        electricity_new_reading,
        electricity_price,

        water_old_reading,
        water_new_reading,
        water_price,

        garbage_fee,
        status
    } = data;

    const [result] = await db.query(`
        INSERT INTO utility_bills (
            room_id,
            tenant_id,
            month,

            electricity_old_reading,
            electricity_new_reading,
            electricity_price,

            water_old_reading,
            water_new_reading,
            water_price,

            garbage_fee,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        room_id,
        tenant_id,
        month,

        electricity_old_reading,
        electricity_new_reading,
        electricity_price,

        water_old_reading,
        water_new_reading,
        water_price,

        garbage_fee,
        status || "Pending"
    ]);

    return result;
};


const updateUtilityBill = async (bill_id, data) => {
    const {
        electricity_old_reading,
        electricity_new_reading,
        electricity_price,
        water_old_reading,
        water_new_reading,
        water_price,

        garbage_fee,
        status
    } = data;

    const [result] = await db.query(`
        UPDATE utility_bills
        SET
            electricity_old_reading = ?,
            electricity_new_reading = ?,
            electricity_price = ?,

            water_old_reading = ?,
            water_new_reading = ?,
            water_price = ?,

            garbage_fee = ?,
            status = ?

        WHERE bill_id = ?
    `, [
        electricity_old_reading,
        electricity_new_reading,
        electricity_price,

        water_old_reading,
        water_new_reading,
        water_price,

        garbage_fee,
        status,

        bill_id
    ]);

    return result;
};


const deleteUtilityBill = async (bill_id) => {
    const [result] = await db.query(`
        DELETE FROM utility_bills
        WHERE bill_id = ?
    `, [bill_id]);

    return result;
};


const getBillsByRoomId = async (room_id) => {
    const [rows] = await db.query(`
        SELECT *
        FROM utility_bills
        WHERE room_id = ?
        ORDER BY month DESC
    `, [room_id]);

    return rows;
};


const getBillsByTenantId = async (tenant_id) => {
    const [rows] = await db.query(`
        SELECT *
        FROM utility_bills
        WHERE tenant_id = ?
        ORDER BY month DESC
    `, [tenant_id]);

    return rows;
};

module.exports = {
    getAllUtilityBills,
    getUtilityBillById,
    createUtilityBill,
    updateUtilityBill,
    deleteUtilityBill,
    getBillsByRoomId,
    getBillsByTenantId
};