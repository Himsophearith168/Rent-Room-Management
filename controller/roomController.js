const roomService = require("../services/RoomService");

const getRoom = async (req, res) => {
    try {
        const result = await roomService.getRoom();
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

const getRoomByID = async (req, res) => {
    try {
        const result = await roomService.getRoomByID(req.params.id);
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

const createRoom = async (req, res) => {
    try {
        const result = await roomService.createRoom(req.body);
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

const updateRoom = async (req, res) => {
    try {
        const result = await roomService.updateRoom(req.params.id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Room not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteRoom = async (req, res) => {
    try {
        await roomService.deleteRoom(req.params.id);
        return res.json({
            success: true,
            message: "Room deleted successfully"
        });
    } catch (error) {
        return res.status(error.message === "Room not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getRoom,
    getRoomByID,
    createRoom,
    updateRoom,
    deleteRoom
};