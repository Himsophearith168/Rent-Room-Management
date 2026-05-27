const pool = require("../config/database");


const getAssignments = async () => {
    const [result] = await pool.query(`
        SELECT 
            ra.assignment_id,
            ra.room_id,
            r.room_number,
            ra.tenant_id,
            t.fullname,
            ra.start_date,
            ra.status
        FROM room_assignments ra
        JOIN rooms r ON ra.room_id = r.room_id
        JOIN tenants t ON ra.tenant_id = t.tenant_id
    `);

    return result;
};


const getAssignmentByID = async (id) => {
    const [result] = await pool.query(`
        SELECT 
            ra.assignment_id,
            ra.room_id,
            r.room_number,
            ra.tenant_id,
            t.fullname,
            ra.start_date,
            ra.status
        FROM room_assignments ra
        JOIN rooms r ON ra.room_id = r.room_id
        JOIN tenants t ON ra.tenant_id = t.tenant_id
        WHERE ra.assignment_id = ?
    `, [id]);

    return result[0];
};


const createAssignment = async (body) => {
    const {
        room_id,
        tenant_id,
        start_date,
        status
    } = body;

    const [result] = await pool.query(`
        INSERT INTO room_assignments
        (room_id, tenant_id, start_date, status)
        VALUES (?, ?, ?, ?)
    `, [
        room_id,
        tenant_id,
        start_date,
        status || "Active"
    ]);

    return result;
};

const updateAssignment = async (id, body) => {
    const {
        room_id,
        tenant_id,
        start_date,
        status
    } = body;

    const [result] = await pool.query(`
        UPDATE room_assignments
        SET room_id = ?, tenant_id = ?, start_date = ?, status = ?
        WHERE assignment_id = ?
    `, [
        room_id,
        tenant_id,
        start_date,
        status,
        id
    ]);

    return result;
};

const deleteAssignment = async (id) => {
    const [result] = await pool.query(`
        DELETE FROM room_assignments
        WHERE assignment_id = ?
    `, [id]);

    return result;
};

module.exports = {
    getAssignments,
    getAssignmentByID,
    createAssignment,
    updateAssignment,
    deleteAssignment
};