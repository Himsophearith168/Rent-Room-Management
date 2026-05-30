const pool = require("../config/database");

const getAssignments = async () => {
    const [result] = await pool.query(`
        SELECT
            ra.assignment_id,
            ra.room_id,
            r.room_number,
            r.room_price,
            ra.tenant_id,
            t.fullname,
            t.phone,
            ra.start_date,
            ra.end_date,
            ra.deposit_amount,
            ra.status,
            ra.created_at
        FROM room_assignments ra
        JOIN rooms r ON ra.room_id = r.room_id
        JOIN tenants t ON ra.tenant_id = t.tenant_id
        ORDER BY ra.created_at DESC
    `);

    return result;
};

const getAssignmentByID = async (id) => {
    const [result] = await pool.query(`
        SELECT
            ra.assignment_id,
            ra.room_id,
            r.room_number,
            r.room_price,
            ra.tenant_id,
            t.fullname,
            t.phone,
            ra.start_date,
            ra.end_date,
            ra.deposit_amount,
            ra.status,
            ra.created_at
        FROM room_assignments ra
        JOIN rooms r ON ra.room_id = r.room_id
        JOIN tenants t ON ra.tenant_id = t.tenant_id
        WHERE ra.assignment_id = ?
    `, [id]);

    return result[0];
};

const getActiveAssignmentByRoom = async (room_id) => {
    const [result] = await pool.query(`
        SELECT
            ra.assignment_id,
            ra.tenant_id,
            t.fullname
        FROM room_assignments ra
        JOIN tenants t ON ra.tenant_id = t.tenant_id
        WHERE ra.room_id = ? AND ra.status = 'Active'
        LIMIT 1
    `, [room_id]);

    return result[0];
};

const createAssignment = async (body) => {
    const {
        room_id,
        tenant_id,
        start_date,
        end_date,
        deposit_amount,
        status
    } = body;

    const [result] = await pool.query(`
        INSERT INTO room_assignments (room_id, tenant_id, start_date, end_date, deposit_amount, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        room_id,
        tenant_id,
        start_date,
        end_date || null,
        deposit_amount || 0,
        status || "Active"
    ]);

    // Mark room as Occupied
    await pool.query(
        "UPDATE rooms SET status = 'Occupied' WHERE room_id = ?",
        [room_id]
    );

    return result;
};

const updateAssignment = async (id, body) => {
    const {
        room_id,
        tenant_id,
        start_date,
        end_date,
        deposit_amount,
        status
    } = body;

    const [result] = await pool.query(`
        UPDATE room_assignments
        SET room_id = ?, tenant_id = ?, start_date = ?, end_date = ?, deposit_amount = ?, status = ?
        WHERE assignment_id = ?
    `, [
        room_id,
        tenant_id,
        start_date,
        end_date || null,
        deposit_amount,
        status,
        id
    ]);

    // If ended, mark room as Available
    if (status === "Ended") {
        await pool.query(
            "UPDATE rooms SET status = 'Available' WHERE room_id = ?",
            [room_id]
        );
    }

    return result;
};

const deleteAssignment = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM room_assignments WHERE assignment_id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getAssignments,
    getAssignmentByID,
    getActiveAssignmentByRoom,
    createAssignment,
    updateAssignment,
    deleteAssignment
};