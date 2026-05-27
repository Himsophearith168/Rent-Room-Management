const utilityMeterService = require("../services/utilityMeterService");

const getAllUtilityMeters = async (req, res) => {
    try {
        const result = await utilityMeterService.getAllUtilityMeters();
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

const getUtilityMeterByRoomId = async (req, res) => {
    try {
        const room_id = req.params.room_id;
        const result = await utilityMeterService.getUtilityMeterByRoomId(room_id);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message.includes("not found") ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const createUtilityMeter = async (req, res) => {
    try {
        const result = await utilityMeterService.createUtilityMeter(req.body);
        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message.includes("already exists") ? 400 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateUtilityMeter = async (req, res) => {
    try {
        const room_id = req.params.room_id;
        const result = await utilityMeterService.updateUtilityMeter(room_id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message.includes("not found") ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteUtilityMeter = async (req, res) => {
    try {
        const room_id = req.params.room_id;
        const result = await utilityMeterService.deleteUtilityMeter(room_id);
        return res.json({
            success: true,
            message: "Utility meter record deleted successfully"
        });
    } catch (error) {
        return res.status(error.message.includes("not found") ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllUtilityMeters,
    getUtilityMeterByRoomId,
    createUtilityMeter,
    updateUtilityMeter,
    deleteUtilityMeter
};
