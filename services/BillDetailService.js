const billDetailModel = require("../models/BillDetail");
const billModel = require("../models/Billmodel");
const utilityRateModel = require("../models/Utilityratemodel");

const getBillDetails = async (bill_id) => {
    if (!bill_id) throw new Error("Bill ID is required");
    return await billDetailModel.getBillDetails(bill_id);
};

const getBillDetailByID = async (id) => {
    if (!id) throw new Error("Detail ID is required");

    const data = await billDetailModel.getBillDetailByID(id);
    if (!data) throw new Error("Bill detail not found");

    return data;
};

const createBillDetail = async (body) => {
    const { bill_id, utility_type_id, old_reading, new_reading, notes } = body;

    if (!bill_id || !utility_type_id) {
        throw new Error("bill_id and utility_type_id are required");
    }

    const bill = await billModel.getBillByID(bill_id);
    if (!bill) throw new Error("Bill not found");

    if (bill.status === "Paid") {
        throw new Error("Cannot add details to a paid bill");
    }

    // Auto-fetch unit_price if not provided
    let unit_price = body.unit_price;
    if (!unit_price) {
        const rate = await utilityRateModel.getActiveRateByType(utility_type_id);
        if (!rate) throw new Error(`No active rate found for utility_type_id ${utility_type_id}`);
        unit_price = rate.unit_price;
    }

    // Auto-calculate quantity for meter-based
    let quantity = body.quantity;
    if (!quantity && old_reading != null && new_reading != null) {
        quantity = new_reading - old_reading;
    }

    if (!quantity || quantity <= 0) {
        throw new Error("quantity must be greater than 0");
    }

    const total_price = parseFloat((quantity * unit_price).toFixed(2));

    const result = await billDetailModel.createBillDetail({
        bill_id,
        utility_type_id,
        old_reading: old_reading || null,
        new_reading: new_reading || null,
        quantity,
        unit_price,
        total_price,
        notes: notes || null
    });

    if (!result.insertId) throw new Error("Failed to create bill detail");

    // Sync bill total
    await billModel.recalculateBillTotal(bill_id);

    return await billDetailModel.getBillDetailByID(result.insertId);
};

const updateBillDetail = async (id, body) => {
    if (!id) throw new Error("Detail ID is required");

    const existing = await billDetailModel.getBillDetailByID(id);
    if (!existing) throw new Error("Bill detail not found");

    const bill = await billModel.getBillByID(existing.bill_id);
    if (bill.status === "Paid") {
        throw new Error("Cannot edit details of a paid bill");
    }

    let { old_reading, new_reading, quantity, unit_price, notes } = body;

    old_reading = old_reading ?? existing.old_reading;
    new_reading = new_reading ?? existing.new_reading;
    unit_price = unit_price || existing.unit_price;

    // Recalculate quantity if readings changed
    if (old_reading != null && new_reading != null) {
        quantity = new_reading - old_reading;
    } else {
        quantity = quantity || existing.quantity;
    }

    if (quantity <= 0) throw new Error("quantity must be greater than 0");

    const total_price = parseFloat((quantity * unit_price).toFixed(2));

    const result = await billDetailModel.updateBillDetail(id, {
        old_reading,
        new_reading,
        quantity,
        unit_price,
        total_price,
        notes: notes ?? existing.notes
    });

    if (result.affectedRows === 0) throw new Error("Update failed");

    // Sync bill total
    await billModel.recalculateBillTotal(existing.bill_id);

    return await billDetailModel.getBillDetailByID(id);
};

const deleteBillDetail = async (id) => {
    if (!id) throw new Error("Detail ID is required");

    const existing = await billDetailModel.getBillDetailByID(id);
    if (!existing) throw new Error("Bill detail not found");

    const bill = await billModel.getBillByID(existing.bill_id);
    if (bill.status === "Paid") {
        throw new Error("Cannot delete details of a paid bill");
    }

    const result = await billDetailModel.deleteBillDetail(id);

    // Sync bill total
    await billModel.recalculateBillTotal(existing.bill_id);

    return result;
};

module.exports = {
    getBillDetails,
    getBillDetailByID,
    createBillDetail,
    updateBillDetail,
    deleteBillDetail
};