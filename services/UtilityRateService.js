const utilityRateModel = require("../models/Utilityratemodel");
const utilityTypeModel = require("../models/utility_type");

const getUtilityRates = async () => {
    return await utilityRateModel.getUtilityRates();
};

const getActiveRates = async () => {
    return await utilityRateModel.getActiveRates();
};

const createUtilityRate = async (body) => {
    const { utility_type_id, unit_price, effective_from } = body;

    if (!utility_type_id || !unit_price || !effective_from) {
        throw new Error("utility_type_id, unit_price, and effective_from are required");
    }

    if (unit_price <= 0) throw new Error("unit_price must be greater than 0");

    const utilityType = await utilityTypeModel.getUtilityTypeByID(utility_type_id);
    if (!utilityType) throw new Error("Utility type not found");

    const result = await utilityRateModel.createUtilityRate({
        utility_type_id,
        unit_price,
        effective_from,
        is_active: true
    });

    if (!result.insertId) throw new Error("Failed to create utility rate");

    const rates = await utilityRateModel.getUtilityRates();
    return rates.find((r) => r.rate_id === result.insertId);
};

const updateUtilityRate = async (id, body) => {
    if (!id) throw new Error("Rate ID is required");

    const rates = await utilityRateModel.getUtilityRates();
    const existing = rates.find((r) => r.rate_id === parseInt(id));
    if (!existing) throw new Error("Utility rate not found");

    if (body.unit_price !== undefined && body.unit_price <= 0) {
        throw new Error("unit_price must be greater than 0");
    }

    const result = await utilityRateModel.updateUtilityRate(id, {
        unit_price: body.unit_price || existing.unit_price,
        effective_from: body.effective_from || existing.effective_from,
        is_active: body.is_active ?? existing.is_active
    });

    if (result.affectedRows === 0) throw new Error("Update failed");

    const updated = await utilityRateModel.getUtilityRates();
    return updated.find((r) => r.rate_id === parseInt(id));
};

const deleteUtilityRate = async (id) => {
    if (!id) throw new Error("Rate ID is required");

    const rates = await utilityRateModel.getUtilityRates();
    const existing = rates.find((r) => r.rate_id === parseInt(id));
    if (!existing) throw new Error("Utility rate not found");

    if (existing.is_active) {
        throw new Error("Cannot delete the active rate. Set another rate as active first.");
    }

    return await utilityRateModel.deleteUtilityRate(id);
};

module.exports = {
    getUtilityRates,
    getActiveRates,
    createUtilityRate,
    updateUtilityRate,
    deleteUtilityRate
};