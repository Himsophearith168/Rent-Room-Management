const meterReadingService = require("../services/MetterReadingService");

const getAllMeterReadings = async (req, res) => {
    try {
        const result = await meterReadingService.getAllMeterReadings();
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMeterReadingsByRoom = async (req, res) => {
    try {
        const result = await meterReadingService.getMeterReadingsByRoom(req.params.room_id);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Room not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const getLatestReading = async (req, res) => {
    try {
        const { room_id, utility_type_id } = req.query;
        const result = await meterReadingService.getLatestReading(room_id, utility_type_id);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "No meter reading found for this room and utility" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const getMeterReadingByID = async (req, res) => {
    try {
        const result = await meterReadingService.getMeterReadingByID(req.params.id);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Meter reading not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const createMeterReading = async (req, res) => {
    try {
        const result = await meterReadingService.createMeterReading(req.body);
        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateMeterReading = async (req, res) => {
    try {
        const result = await meterReadingService.updateMeterReading(req.params.id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Meter reading not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteMeterReading = async (req, res) => {
    try {
        await meterReadingService.deleteMeterReading(req.params.id);
        return res.json({
            success: true,
            message: "Meter reading deleted successfully"
        });
    } catch (error) {
        return res.status(error.message === "Meter reading not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
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