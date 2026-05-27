const billModel = require("../models/utilityBillModel");

const getBills = async () => {
    return await billModel.getAllUtilityBills();
};

const getBillByID = async (id) => {
    if (!id) {
        throw new Error("Bill ID is required");
    }

    const data = await billModel.getUtilityBillById(id);

    if (!data) {
        throw new Error("Bill not found");
    }

    return data;
};

const createBill = async (body) => {
    const {
        room_id,
        tenant_id,
        month,
        electricity_old_reading = 0,
        electricity_new_reading = 0,
        electricity_price = 0,
        water_old_reading = 0,
        water_new_reading = 0,
        water_price = 0,
        garbage_fee = 0,
        status = "Pending"
    } = body;

    if (!room_id || !tenant_id || !month) {
        throw new Error("room_id, tenant_id, and month are required");
    }

    const data = await billModel.createUtilityBill({
        room_id,
        tenant_id,
        month,
        electricity_old_reading,
        electricity_new_reading,
        electricity_price,
        water_old_reading,
        water_new_reading,
        water_price,
        garbage_fee,
        status
    });

    return await billModel.getUtilityBillById(data.insertId);
};

const updateBill = async (id, body) => {
    if (!id) {
        throw new Error("Bill ID is required");
    }

    const existing = await billModel.getUtilityBillById(id);

    if (!existing) {
        throw new Error("Bill not found");
    }

    const {
        electricity_old_reading = existing.electricity_old_reading,
        electricity_new_reading = existing.electricity_new_reading,
        electricity_price = existing.electricity_price,
        water_old_reading = existing.water_old_reading,
        water_new_reading = existing.water_new_reading,
        water_price = existing.water_price,
        garbage_fee = existing.garbage_fee,
        status = existing.status
    } = body;

    const result = await billModel.updateUtilityBill(id, {
        electricity_old_reading,
        electricity_new_reading,
        electricity_price,
        water_old_reading,
        water_new_reading,
        water_price,
        garbage_fee,
        status
    });

    if (result.affectedRows === 0) {
        throw new Error("Update failed");
    }

    return await billModel.getUtilityBillById(id);
};

const deleteBill = async (id) => {
    if (!id) {
        throw new Error("Bill ID is required");
    }

    const existing = await billModel.getUtilityBillById(id);

    if (!existing) {
        throw new Error("Bill not found");
    }

    return await billModel.deleteUtilityBill(id);
};

module.exports = {
    getBills,
    getBillByID,
    createBill,
    updateBill,
    deleteBill
};
