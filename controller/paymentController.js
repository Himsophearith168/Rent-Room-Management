const paymentService = require("../services/PaymentService");

const getPayments = async (req, res) => {
    try {
        const result = await paymentService.getPayments();
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

const getPaymentByID = async (req, res) => {
    try {
        const result = await paymentService.getPaymentByID(req.params.id);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Payment not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const getPaymentsByBill = async (req, res) => {
    try {
        const result = await paymentService.getPaymentsByBill(req.params.bill_id);
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

const createPayment = async (req, res) => {
    try {
        const body = { ...req.body };
        if (req.file) {
            body.proof_image = req.file.filename;
        }
        const result = await paymentService.createPayment(body);
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

const updatePayment = async (req, res) => {
    try {
        const body = { ...req.body };
        if (req.file) {
            body.proof_image = req.file.filename;
        }
        const result = await paymentService.updatePayment(req.params.id, body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Payment not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const deletePayment = async (req, res) => {
    try {
        await paymentService.deletePayment(req.params.id);
        return res.json({
            success: true,
            message: "Payment deleted successfully"
        });
    } catch (error) {
        return res.status(error.message === "Payment not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getPayments,
    getPaymentByID,
    getPaymentsByBill,
    createPayment,
    updatePayment,
    deletePayment
};