const roomModel = require("../models/Roommodel");

const getRoom = async () => {
    return await roomModel.getRoom();
};

const getRoomByID = async (id) => {
    if (!id) throw new Error("Room ID is required");

    const room = await roomModel.getRoomByID(id);
    if (!room) throw new Error("Room not found");

    return room;
};

const createRoom = async (body) => {
    const { room_number, room_price } = body;

    if (!room_number || !room_price) {
        throw new Error("room_number and room_price are required");
    }

    if (room_price <= 0) {
        throw new Error("room_price must be greater than 0");
    }

    const data = await roomModel.createRoom(body);

    if (!data.insertId) throw new Error("Failed to create room");

    return await roomModel.getRoomByID(data.insertId);
};

const updateRoom = async (id, body) => {
    if (!id) throw new Error("Room ID is required");

    const room = await roomModel.getRoomByID(id);
    if (!room) throw new Error("Room not found");

    if (body.room_price !== undefined && body.room_price <= 0) {
        throw new Error("room_price must be greater than 0");
    }

    const result = await roomModel.updateRoom(id, {
        room_number: body.room_number || room.room_number,
        room_price: body.room_price || room.room_price,
        floor_number: body.floor_number ?? room.floor_number,
        description: body.description ?? room.description,
        status: body.status || room.status
    });

    if (result.affectedRows === 0) throw new Error("Update failed");

    return await roomModel.getRoomByID(id);
};

const deleteRoom = async (id) => {
    if (!id) throw new Error("Room ID is required");

    const room = await roomModel.getRoomByID(id);
    if (!room) throw new Error("Room not found");

    if (room.status === "Occupied") {
        throw new Error("Cannot delete an occupied room");
    }

    return await roomModel.deleteRoom(id);
};

module.exports = {
    getRoom,
    getRoomByID,
    createRoom,
    updateRoom,
    deleteRoom
};