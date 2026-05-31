const tenantService = require("../services/TenantService");

const getTenant = async (req, res) => {
    try {
        const result = await tenantService.getTenant();
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

const getTenantByID = async (req, res) => {
    try {
        const result = await tenantService.getTenantByID(req.params.id);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Tenant not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const createTenant = async (req, res) => {
    try {
        const result = await tenantService.createTenant(req.body);
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

const updateTenant = async (req, res) => {
    try {
        const result = await tenantService.updateTenant(req.params.id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "Tenant not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteTenant = async (req, res) => {
    try {
        await tenantService.deleteTenant(req.params.id);
        return res.json({
            success: true,
            message: "Tenant deleted successfully"
        });
    } catch (error) {
        return res.status(error.message === "Tenant not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getTenant, getTenantByID, createTenant, updateTenant, deleteTenant };