
const db = require("../config/database");

const getAllUtilityMeters = async () => {
    const [rows] = await db.query(`
        SELECT 
            um.room_id,
            r.room_number,
            um.electricity_current_reading,
            um.water_current_reading,
            um.updated_at
        FROM utility_meters um
        JOIN rooms r ON um.room_id = r.room_id
        ORDER BY um.room_id ASC
    `);

    return rows;
};

const getUtilityMeterByRoomId = async (room_id) => {
    const [rows] = await db.query(`
        SELECT 
            um.room_id,
            r.room_number,
            um.electricity_current_reading,
            um.water_current_reading,
            um.updated_at
        FROM utility_meters um
        JOIN rooms r ON um.room_id = r.room_id
        WHERE um.room_id = ?
    `, [room_id]);

    return rows[0];
};

const createUtilityMeter = async (data) => {
    const {
        room_id,
        electricity_current_reading,
        water_current_reading
    } = data;

    const [result] = await db.query(`
        INSERT INTO utility_meters (
            room_id,
            electricity_current_reading,
            water_current_reading
        )
        VALUES (?, ?, ?)
    `, [
        room_id,
        electricity_current_reading,
        water_current_reading
    ]);

    return result;
};

const updateUtilityMeter = async (room_id, data) => {
    const {
        electricity_current_reading,
        water_current_reading
    } = data;

    const [result] = await db.query(`
        UPDATE utility_meters
        SET
            electricity_current_reading = ?,
            water_current_reading = ?
        WHERE room_id = ?
    `, [
        electricity_current_reading,
        water_current_reading,
        room_id
    ]);

    return result;
};

const deleteUtilityMeter = async (room_id) => {
    const [result] = await db.query(`
        DELETE FROM utility_meters
        WHERE room_id = ?
    `, [room_id]);

    return result;
};

module.exports = {
    getAllUtilityMeters,
    getUtilityMeterByRoomId,
    createUtilityMeter,
    updateUtilityMeter,
    deleteUtilityMeter
};