const billDetailService = require("../services/BillDetailService");

const getBillDetails = async (req, res) => {
    try {
        const result = await billDetailService.getBillDetails(req.query.bill_id);
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

const getBillDetailByID = async (req, res) => {
    try {
        const result = await billDetailService.getBillDetailByID(req.params.id);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Bill detail not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const createBillDetail = async (req, res) => {
    try {
        const result = await billDetailService.createBillDetail(req.body);
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

const updateBillDetail = async (req, res) => {
    try {
        const result = await billDetailService.updateBillDetail(req.params.id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Bill detail not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteBillDetail = async (req, res) => {
    try {
        await billDetailService.deleteBillDetail(req.params.id);
        return res.json({
            success: true,
            message: "Bill detail deleted successfully"
        });
    } catch (error) {
        return res.status(error.message === "Bill detail not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getBillDetails,
    getBillDetailByID,
    createBillDetail,
    updateBillDetail,
    deleteBillDetail
};