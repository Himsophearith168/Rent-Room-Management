const utilityTypeService = require("../services/UtilityTypeService");

const getUtilityTypes = async (req, res) => {
    try {
        const result = await utilityTypeService.getUtilityTypes();
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

const getUtilityTypeByID = async (req, res) => {
    try {
        const result = await utilityTypeService.getUtilityTypeByID(req.params.id);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Utility type not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const createUtilityType = async (req, res) => {
    try {
        const result = await utilityTypeService.createUtilityType(req.body);
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

const updateUtilityType = async (req, res) => {
    try {
        const result = await utilityTypeService.updateUtilityType(req.params.id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Utility type not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteUtilityType = async (req, res) => {
    try {
        await utilityTypeService.deleteUtilityType(req.params.id);
        return res.json({
            success: true,
            message: "Utility type deleted successfully"
        });
    } catch (error) {
        return res.status(error.message === "Utility type not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getUtilityTypes,
    getUtilityTypeByID,
    createUtilityType,
    updateUtilityType,
    deleteUtilityType
};