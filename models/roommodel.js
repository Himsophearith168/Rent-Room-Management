const pool = require("../config/database");

const getRoom = async () => {
    const [result] = await pool.query("SELECT * FROM rooms ORDER BY room_number ASC");
    return result;
};

const getRoomByID = async (id) => {
    const [result] = await pool.query(
        "SELECT * FROM rooms WHERE room_id = ?",
        [id]
    );
    return result[0];
};

const createRoom = async (body) => {
    const {
        room_number,
        room_price,
        floor_number,
        description,
        status
    } = body;

    const [result] = await pool.query(
        `INSERT INTO rooms (room_number, room_price, floor_number, description, status)
         VALUES (?, ?, ?, ?, ?)`,
        [
            room_number,
            room_price,
            floor_number || null,
            description || null,
            status || "Available"
        ]
    );

    return result;
};

const updateRoom = async (id, body) => {
    const {
        room_number,
        room_price,
        floor_number,
        description,
        status
    } = body;

    const [result] = await pool.query(
        `UPDATE rooms
         SET room_number = ?, room_price = ?, floor_number = ?, description = ?, status = ?
         WHERE room_id = ?`,
        [room_number, room_price, floor_number, description, status, id]
    );

    return result;
};

const deleteRoom = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM rooms WHERE room_id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getRoom,
    getRoomByID,
    createRoom,
    updateRoom,
    deleteRoom
};