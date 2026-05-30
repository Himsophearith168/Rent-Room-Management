const assignmentModel = require("../models/Roomassignmodel");
const roomModel = require("../models/Roommodel");

const getAssignments = async () => {
    return await assignmentModel.getAssignments();
};

const getAssignmentByID = async (id) => {
    if (!id) throw new Error("Assignment ID is required");

    const data = await assignmentModel.getAssignmentByID(id);
    if (!data) throw new Error("Assignment not found");

    return data;
};

const createAssignment = async (body) => {
    const { room_id, tenant_id, start_date } = body;

    if (!room_id || !tenant_id || !start_date) {
        throw new Error("room_id, tenant_id, and start_date are required");
    }

    // Prevent double-assigning an occupied room
    const room = await roomModel.getRoomByID(room_id);
    if (!room) throw new Error("Room not found");

    if (room.status === "Occupied") {
        throw new Error("Room is already occupied");
    }

    const result = await assignmentModel.createAssignment({
        room_id,
        tenant_id,
        start_date,
        end_date: body.end_date || null,
        deposit_amount: body.deposit_amount || 0,
        status: "Active"
    });

    if (!result.insertId) throw new Error("Failed to create assignment");

    return await assignmentModel.getAssignmentByID(result.insertId);
};

const updateAssignment = async (id, body) => {
    if (!id) throw new Error("Assignment ID is required");

    const existing = await assignmentModel.getAssignmentByID(id);
    if (!existing) throw new Error("Assignment not found");

    const allowedStatus = ["Active", "Ended"];
    if (body.status && !allowedStatus.includes(body.status)) {
        throw new Error("status must be 'Active' or 'Ended'");
    }

    const result = await assignmentModel.updateAssignment(id, {
        room_id: body.room_id || existing.room_id,
        tenant_id: body.tenant_id || existing.tenant_id,
        start_date: body.start_date || existing.start_date,
        end_date: body.end_date ?? existing.end_date,
        deposit_amount: body.deposit_amount ?? existing.deposit_amount,
        status: body.status || existing.status
    });

    if (result.affectedRows === 0) throw new Error("Update failed");

    return await assignmentModel.getAssignmentByID(id);
};

const endAssignment = async (id, end_date) => {
    if (!id) throw new Error("Assignment ID is required");

    const existing = await assignmentModel.getAssignmentByID(id);
    if (!existing) throw new Error("Assignment not found");

    if (existing.status === "Ended") {
        throw new Error("Assignment is already ended");
    }

    const result = await assignmentModel.updateAssignment(id, {
        room_id: existing.room_id,
        tenant_id: existing.tenant_id,
        start_date: existing.start_date,
        end_date: end_date || new Date(),
        deposit_amount: existing.deposit_amount,
        status: "Ended"
    });

    if (result.affectedRows === 0) throw new Error("Failed to end assignment");

    return await assignmentModel.getAssignmentByID(id);
};

const deleteAssignment = async (id) => {
    if (!id) throw new Error("Assignment ID is required");

    const existing = await assignmentModel.getAssignmentByID(id);
    if (!existing) throw new Error("Assignment not found");

    if (existing.status === "Active") {
        throw new Error("Cannot delete an active assignment. End it first.");
    }

    return await assignmentModel.deleteAssignment(id);
};

module.exports = {
    getAssignments,
    getAssignmentByID,
    createAssignment,
    updateAssignment,
    endAssignment,
    deleteAssignment
};