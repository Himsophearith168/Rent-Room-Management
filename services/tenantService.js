const tenantModel = require("../models/Tenantmodel");

const getTenant = async () => {
    return await tenantModel.getTenant();
};

const getTenantByID = async (id) => {
    if (!id) throw new Error("Tenant ID is required");

    const tenant = await tenantModel.getTenantByID(id);
    if (!tenant) throw new Error("Tenant not found");

    return tenant;
};

const createTenant = async (body) => {
    const { fullname } = body;

    if (!fullname) throw new Error("fullname is required");

    const data = await tenantModel.createTenant(body);
    if (!data.insertId) throw new Error("Failed to create tenant");

    return await tenantModel.getTenantByID(data.insertId);
};

const updateTenant = async (id, body) => {
    if (!id) throw new Error("Tenant ID is required");

    const tenant = await tenantModel.getTenantByID(id);
    if (!tenant) throw new Error("Tenant not found");

    const result = await tenantModel.updateTenant(id, {
        fullname: body.fullname || tenant.fullname,
        gender: body.gender ?? tenant.gender,
        phone: body.phone ?? tenant.phone,
        telegram: body.telegram ?? tenant.telegram,
        id_card: body.id_card ?? tenant.id_card,
        emergency_contact: body.emergency_contact ?? tenant.emergency_contact,
        address: body.address ?? tenant.address
    });

    if (result.affectedRows === 0) throw new Error("Update failed");

    return await tenantModel.getTenantByID(id);
};

const deleteTenant = async (id) => {
    if (!id) throw new Error("Tenant ID is required");

    const tenant = await tenantModel.getTenantByID(id);
    if (!tenant) throw new Error("Tenant not found");

    return await tenantModel.deleteTenant(id);
};

module.exports = {
    getTenant,
    getTenantByID,
    createTenant,
    updateTenant,
    deleteTenant
};