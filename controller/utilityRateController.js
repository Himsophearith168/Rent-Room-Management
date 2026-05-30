const billService = require("../services/utilityBillService");


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
        const id = req.params.id;

        const result = await billService.getBillByID(id);

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

const updateBill = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await billService.updateBill(id, req.body);

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


const deleteBill = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await billService.deleteBill(id);

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

module.exports = {
    getBills,
    getBillByID,
    createBill,
    updateBill,
    deleteBill
};