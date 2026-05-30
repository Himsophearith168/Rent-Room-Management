const tenantService = require("../services/TenantService");

const getTenant = async (req, res) => {
    try {
        const data = await tenantService.getTenant();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getTenantByID = async (req, res) => {
    try {
        const data = await tenantService.getTenantByID(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

const createTenant = async (req, res) => {
    try {
        const data = await tenantService.createTenant(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateTenant = async (req, res) => {
    try {
        const data = await tenantService.updateTenant(req.params.id, req.body);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteTenant = async (req, res) => {
    try {
        await tenantService.deleteTenant(req.params.id);
        res.json({ message: "Tenant deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { getTenant, getTenantByID, createTenant, updateTenant, deleteTenant };