const billService = require("../services/Billservice");

const getBills = async (req, res) => {
    try {
        const result = await billService.getBills();
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

const getBillByID = async (req, res) => {
    try {
        const result = await billService.getBillByID(req.params.id);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Bill not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const getBillsByAssignment = async (req, res) => {
    try {
        const result = await billService.getBillsByAssignment(req.params.assignment_id);
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

const createBill = async (req, res) => {
    try {
        const result = await billService.createBill(req.body);
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

const updateBill = async (req, res) => {
    try {
        const result = await billService.updateBill(req.params.id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Bill not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteBill = async (req, res) => {
    try {
        await billService.deleteBill(req.params.id);
        return res.json({
            success: true,
            message: "Bill deleted successfully"
        });
    } catch (error) {
        return res.status(error.message === "Bill not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getBills,
    getBillByID,
    getBillsByAssignment,
    createBill,
    updateBill,
    deleteBill
};