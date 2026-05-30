const pool = require("../config/database");

/**
 * Replaces the old utility_meters table (which only stored current readings).
 * meter_readings keeps full history so the previous month's reading is always available.
 */

const getAllMeterReadings = async () => {
    const [result] = await pool.query(`
        SELECT
            mr.reading_id,
            mr.room_id,
            r.room_number,
            mr.utility_type_id,
            ut.utility_name,
            ut.unit,
            mr.reading_date,
            mr.meter_value
        FROM meter_readings mr
        JOIN rooms r ON mr.room_id = r.room_id
        JOIN utility_types ut ON mr.utility_type_id = ut.utility_type_id
        ORDER BY mr.room_id ASC, mr.utility_type_id ASC, mr.reading_date DESC
    `);

    return result;
};

const getMeterReadingsByRoom = async (room_id) => {
    const [result] = await pool.query(`
        SELECT
            mr.reading_id,
            mr.utility_type_id,
            ut.utility_name,
            ut.unit,
            mr.reading_date,
            mr.meter_value
        FROM meter_readings mr
        JOIN utility_types ut ON mr.utility_type_id = ut.utility_type_id
        WHERE mr.room_id = ?
        ORDER BY mr.utility_type_id ASC, mr.reading_date DESC
    `, [room_id]);

    return result;
};

/**
 * Get the most recent reading for a room + utility.
 * Used to auto-fill "old_reading" when creating a new monthly bill.
 */
const getLatestReading = async (room_id, utility_type_id) => {
    const [result] = await pool.query(`
        SELECT meter_value, reading_date
        FROM meter_readings
        WHERE room_id = ? AND utility_type_id = ?
        ORDER BY reading_date DESC
        LIMIT 1
    `, [room_id, utility_type_id]);

    return result[0];
};

const getMeterReadingByID = async (id) => {
    const [result] = await pool.query(`
        SELECT
            mr.reading_id,
            mr.room_id,
            r.room_number,
            mr.utility_type_id,
            ut.utility_name,
            mr.reading_date,
            mr.meter_value
        FROM meter_readings mr
        JOIN rooms r ON mr.room_id = r.room_id
        JOIN utility_types ut ON mr.utility_type_id = ut.utility_type_id
        WHERE mr.reading_id = ?
    `, [id]);

    return result[0];
};

const createMeterReading = async (body) => {
    const {
        room_id,
        utility_type_id,
        reading_date,
        meter_value
    } = body;

    const [result] = await pool.query(`
        INSERT INTO meter_readings (room_id, utility_type_id, reading_date, meter_value)
        VALUES (?, ?, ?, ?)
    `, [
        room_id,
        utility_type_id,
        reading_date,
        meter_value
    ]);

    return result;
};

const updateMeterReading = async (id, body) => {
    const { reading_date, meter_value } = body;

    const [result] = await pool.query(`
        UPDATE meter_readings
        SET reading_date = ?, meter_value = ?
        WHERE reading_id = ?
    `, [reading_date, meter_value, id]);

    return result;
};

const deleteMeterReading = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM meter_readings WHERE reading_id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getAllMeterReadings,
    getMeterReadingsByRoom,
    getLatestReading,
    getMeterReadingByID,
    createMeterReading,
    updateMeterReading,
    deleteMeterReading
};