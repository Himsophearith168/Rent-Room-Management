const roomAssignService = require("../services/RoomAssignService");

const getAssignments = async (req, res) => {
    try {
        const result = await roomAssignService.getAssignments();
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

const getAssignmentByID = async (req, res) => {
    try {
        const result = await roomAssignService.getAssignmentByID(req.params.id);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Assignment not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const createAssignment = async (req, res) => {
    try {
        const result = await roomAssignService.createAssignment(req.body);
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

const updateAssignment = async (req, res) => {
    try {
        const result = await roomAssignService.updateAssignment(req.params.id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Assignment not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const endAssignment = async (req, res) => {
    try {
        const result = await roomAssignService.endAssignment(req.params.id, req.body.end_date);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Assignment not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        await roomAssignService.deleteAssignment(req.params.id);
        return res.json({
            success: true,
            message: "Assignment deleted successfully"
        });
    } catch (error) {
        return res.status(error.message === "Assignment not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAssignments,
    getAssignmentByID,
    createAssignment,
    updateAssignment,
    endAssignment,
    deleteAssignment
};