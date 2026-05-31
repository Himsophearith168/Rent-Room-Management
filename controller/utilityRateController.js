const utilityRateService = require("../services/UtilityRateService");

const getUtilityRates = async (req, res) => {
    try {
        const result = await utilityRateService.getUtilityRates();
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

const getActiveRates = async (req, res) => {
    try {
        const result = await utilityRateService.getActiveRates();
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

const createUtilityRate = async (req, res) => {
    try {
        const result = await utilityRateService.createUtilityRate(req.body);
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

const updateUtilityRate = async (req, res) => {
    try {
        const result = await utilityRateService.updateUtilityRate(req.params.id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Utility rate not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteUtilityRate = async (req, res) => {
    try {
        await utilityRateService.deleteUtilityRate(req.params.id);
        return res.json({
            success: true,
            message: "Utility rate deleted successfully"
        });
    } catch (error) {
        return res.status(error.message === "Utility rate not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getUtilityRates,
    getActiveRates,
    createUtilityRate,
    updateUtilityRate,
    deleteUtilityRate
};