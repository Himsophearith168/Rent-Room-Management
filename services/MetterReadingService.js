const meterReadingModel = require("../models/meter_readings");
const roomModel = require("../models/Roommodel");

const getAllMeterReadings = async () => {
    return await meterReadingModel.getAllMeterReadings();
};

const getMeterReadingsByRoom = async (room_id) => {
    if (!room_id) throw new Error("Room ID is required");

    const room = await roomModel.getRoomByID(room_id);
    if (!room) throw new Error("Room not found");

    return await meterReadingModel.getMeterReadingsByRoom(room_id);
};

/**
 * Get the latest reading for a room + utility.
 * Used to pre-fill "old_reading" when generating a new bill.
 */
const getLatestReading = async (room_id, utility_type_id) => {
    if (!room_id || !utility_type_id) {
        throw new Error("room_id and utility_type_id are required");
    }

    const data = await meterReadingModel.getLatestReading(room_id, utility_type_id);
    if (!data) throw new Error("No meter reading found for this room and utility");

    return data;
};

const getMeterReadingByID = async (id) => {
    if (!id) throw new Error("Reading ID is required");

    const data = await meterReadingModel.getMeterReadingByID(id);
    if (!data) throw new Error("Meter reading not found");

    return data;
};

const createMeterReading = async (body) => {
    const { room_id, utility_type_id, reading_date, meter_value } = body;

    if (!room_id || !utility_type_id || !reading_date || meter_value == null) {
        throw new Error("room_id, utility_type_id, reading_date, and meter_value are required");
    }

    if (meter_value < 0) throw new Error("meter_value cannot be negative");

    // Validate new reading is not less than the latest one
    const latest = await meterReadingModel.getLatestReading(room_id, utility_type_id).catch(() => null);
    if (latest && parseFloat(meter_value) < parseFloat(latest.meter_value)) {
        throw new Error(
            `meter_value (${meter_value}) cannot be less than the previous reading (${latest.meter_value})`
        );
    }

    const result = await meterReadingModel.createMeterReading({
        room_id,
        utility_type_id,
        reading_date,
        meter_value
    });

    if (!result.insertId) throw new Error("Failed to create meter reading");

    return await meterReadingModel.getMeterReadingByID(result.insertId);
};

const updateMeterReading = async (id, body) => {
    if (!id) throw new Error("Reading ID is required");

    const existing = await meterReadingModel.getMeterReadingByID(id);
    if (!existing) throw new Error("Meter reading not found");

    const { reading_date, meter_value } = body;

    if (meter_value !== undefined && meter_value < 0) {
        throw new Error("meter_value cannot be negative");
    }

    const result = await meterReadingModel.updateMeterReading(id, {
        reading_date: reading_date || existing.reading_date,
        meter_value: meter_value ?? existing.meter_value
    });

    if (result.affectedRows === 0) throw new Error("Update failed");

    return await meterReadingModel.getMeterReadingByID(id);
};

const deleteMeterReading = async (id) => {
    if (!id) throw new Error("Reading ID is required");

    const existing = await meterReadingModel.getMeterReadingByID(id);
    if (!existing) throw new Error("Meter reading not found");

    return await meterReadingModel.deleteMeterReading(id);
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