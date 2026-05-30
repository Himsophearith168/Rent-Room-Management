const billModel = require("../models/Billmodel");
const billDetailModel = require("../models/BillDetail");
const assignmentModel = require("../models/Roomassignmodel");
const utilityRateModel = require("../models/Utilityratemodel");
const meterReadingModel = require("../models/meter_readings");

const getBills = async () => {
    return await billModel.getBills();
};

const getBillByID = async (id) => {
    if (!id) throw new Error("Bill ID is required");

    const bill = await billModel.getBillByID(id);
    if (!bill) throw new Error("Bill not found");

    const details = await billDetailModel.getBillDetails(id);

    return { ...bill, details };
};

const getBillsByAssignment = async (assignment_id) => {
    if (!assignment_id) throw new Error("Assignment ID is required");
    return await billModel.getBillsByAssignment(assignment_id);
};

/**
 * Create a bill with utility line items in one call.
 *
 * Body shape:
 * {
 *   assignment_id,
 *   bill_month,          // e.g. "2026-05-01"
 *   room_rent,
 *   other_fee,           // optional
 *   due_date,            // optional
 *   details: [
 *     {
 *       utility_type_id,
 *       old_reading,     // meter-based only
 *       new_reading,     // meter-based only
 *       quantity,        // for fixed: 1
 *       unit_price,      // fetched from active rate if omitted
 *       notes
 *     }
 *   ]
 * }
 */
const createBill = async (body) => {
    const { assignment_id, bill_month, room_rent, other_fee, due_date, details = [] } = body;

    if (!assignment_id || !bill_month || !room_rent) {
        throw new Error("assignment_id, bill_month, and room_rent are required");
    }

    if (room_rent <= 0) throw new Error("room_rent must be greater than 0");

    const assignment = await assignmentModel.getAssignmentByID(assignment_id);
    if (!assignment) throw new Error("Assignment not found");

    if (assignment.status === "Ended") {
        throw new Error("Cannot create a bill for an ended assignment");
    }

    // Insert the bill header
    const billResult = await billModel.createBill({
        assignment_id,
        bill_month,
        room_rent,
        other_fee: other_fee || 0,
        due_date: due_date || null,
        status: "Draft"
    });

    if (!billResult.insertId) throw new Error("Failed to create bill");

    const bill_id = billResult.insertId;

    // Insert each utility detail line
    for (const detail of details) {
        const { utility_type_id, old_reading, new_reading, notes } = detail;

        if (!utility_type_id) throw new Error("utility_type_id is required in each detail");

        // Auto-fetch unit_price from active rate if not provided
        let unit_price = detail.unit_price;
        if (!unit_price) {
            const rate = await utilityRateModel.getActiveRateByType(utility_type_id);
            if (!rate) throw new Error(`No active rate found for utility_type_id ${utility_type_id}`);
            unit_price = rate.unit_price;
        }

        // Auto-calculate quantity for meter-based utilities
        let quantity = detail.quantity;
        if (!quantity && old_reading != null && new_reading != null) {
            quantity = new_reading - old_reading;
        }

        if (!quantity || quantity <= 0) {
            throw new Error(`Invalid quantity for utility_type_id ${utility_type_id}`);
        }

        const total_price = parseFloat((quantity * unit_price).toFixed(2));

        await billDetailModel.createBillDetail({
            bill_id,
            utility_type_id,
            old_reading: old_reading || null,
            new_reading: new_reading || null,
            quantity,
            unit_price,
            total_price,
            notes: notes || null
        });
    }

    // Recalculate total_amount on the bill
    await billModel.recalculateBillTotal(bill_id);

    // Set status to Unpaid now that it's ready
    await billModel.updateBill(bill_id, {
        room_rent,
        other_fee: other_fee || 0,
        due_date: due_date || null,
        status: "Unpaid"
    });

    return await getBillByID(bill_id);
};

const updateBill = async (id, body) => {
    if (!id) throw new Error("Bill ID is required");

    const existing = await billModel.getBillByID(id);
    if (!existing) throw new Error("Bill not found");

    if (existing.status === "Paid") {
        throw new Error("Cannot edit a fully paid bill");
    }

    const result = await billModel.updateBill(id, {
        room_rent: body.room_rent || existing.room_rent,
        other_fee: body.other_fee ?? existing.other_fee,
        due_date: body.due_date ?? existing.due_date,
        status: body.status || existing.status
    });

    if (result.affectedRows === 0) throw new Error("Update failed");

    // Recalculate total if rent or other_fee changed
    if (body.room_rent || body.other_fee !== undefined) {
        await billModel.recalculateBillTotal(id);
    }

    return await getBillByID(id);
};

const deleteBill = async (id) => {
    if (!id) throw new Error("Bill ID is required");

    const existing = await billModel.getBillByID(id);
    if (!existing) throw new Error("Bill not found");

    if (existing.status === "Paid") {
        throw new Error("Cannot delete a paid bill");
    }

    return await billModel.deleteBill(id);
};

module.exports = {
    getBills,
    getBillByID,
    getBillsByAssignment,
    createBill,
    updateBill,
    deleteBill
};