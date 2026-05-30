const utilityTypeModel = require("../models/utility_type");

const getUtilityTypes = async () => {
    return await utilityTypeModel.getUtilityTypes();
};

const getUtilityTypeByID = async (id) => {
    if (!id) throw new Error("Utility type ID is required");

    const data = await utilityTypeModel.getUtilityTypeByID(id);
    if (!data) throw new Error("Utility type not found");

    return data;
};

const createUtilityType = async (body) => {
    const { utility_name, billing_type, unit } = body;

    if (!utility_name || !billing_type) {
        throw new Error("utility_name and billing_type are required");
    }

    const allowedBillingTypes = ["Meter", "Fixed"];
    if (!allowedBillingTypes.includes(billing_type)) {
        throw new Error("billing_type must be 'Meter' or 'Fixed'");
    }

    const result = await utilityTypeModel.createUtilityType({ utility_name, billing_type, unit });
    if (!result.insertId) throw new Error("Failed to create utility type");

    return await utilityTypeModel.getUtilityTypeByID(result.insertId);
};

const updateUtilityType = async (id, body) => {
    if (!id) throw new Error("Utility type ID is required");

    const existing = await utilityTypeModel.getUtilityTypeByID(id);
    if (!existing) throw new Error("Utility type not found");

    const allowedBillingTypes = ["Meter", "Fixed"];
    if (body.billing_type && !allowedBillingTypes.includes(body.billing_type)) {
        throw new Error("billing_type must be 'Meter' or 'Fixed'");
    }

    const result = await utilityTypeModel.updateUtilityType(id, {
        utility_name: body.utility_name || existing.utility_name,
        billing_type: body.billing_type || existing.billing_type,
        unit: body.unit ?? existing.unit
    });

    if (result.affectedRows === 0) throw new Error("Update failed");

    return await utilityTypeModel.getUtilityTypeByID(id);
};

const deleteUtilityType = async (id) => {
    if (!id) throw new Error("Utility type ID is required");

    const existing = await utilityTypeModel.getUtilityTypeByID(id);
    if (!existing) throw new Error("Utility type not found");

    return await utilityTypeModel.deleteUtilityType(id);
};

module.exports = {
    getUtilityTypes,
    getUtilityTypeByID,
    createUtilityType,
    updateUtilityType,
    deleteUtilityType
};