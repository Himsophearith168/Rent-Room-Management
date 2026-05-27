const utilityMeterModel = require("../models/utilitymeters");

const getAllUtilityMeters = async () => {
    return await utilityMeterModel.getAllUtilityMeters();
};

const getUtilityMeterByRoomId = async (room_id) => {
    if (!room_id) {
        throw new Error("Room ID is required");
    }

    const data = await utilityMeterModel.getUtilityMeterByRoomId(room_id);

    if (!data) {
        throw new Error("Utility meter record not found for this room");
    }

    return data;
};

const createUtilityMeter = async (body) => {
    const {
        room_id,
        electricity_current_reading = 0,
        water_current_reading = 0
    } = body;

    if (!room_id) {
        throw new Error("Room ID is required");
    }

    // Check if it already exists
    const existing = await utilityMeterModel.getUtilityMeterByRoomId(room_id);
    if (existing) {
        throw new Error("Utility meter record already exists for this room");
    }

    const result = await utilityMeterModel.createUtilityMeter({
        room_id,
        electricity_current_reading,
        water_current_reading
    });

    return await utilityMeterModel.getUtilityMeterByRoomId(room_id);
};

const updateUtilityMeter = async (room_id, body) => {
    if (!room_id) {
        throw new Error("Room ID is required");
    }

    const existing = await utilityMeterModel.getUtilityMeterByRoomId(room_id);

    if (!existing) {
        throw new Error("Utility meter record not found for this room");
    }

    const {
        electricity_current_reading = existing.electricity_current_reading,
        water_current_reading = existing.water_current_reading
    } = body;

    const result = await utilityMeterModel.updateUtilityMeter(room_id, {
        electricity_current_reading,
        water_current_reading
    });

    if (result.affectedRows === 0) {
        throw new Error("Update failed");
    }

    return await utilityMeterModel.getUtilityMeterByRoomId(room_id);
};

const deleteUtilityMeter = async (room_id) => {
    if (!room_id) {
        throw new Error("Room ID is required");
    }

    const existing = await utilityMeterModel.getUtilityMeterByRoomId(room_id);

    if (!existing) {
        throw new Error("Utility meter record not found for this room");
    }

    return await utilityMeterModel.deleteUtilityMeter(room_id);
};

module.exports = {
    getAllUtilityMeters,
    getUtilityMeterByRoomId,
    createUtilityMeter,
    updateUtilityMeter,
    deleteUtilityMeter
};
