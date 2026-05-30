const pool = require("../config/database");

const getUtilityTypes = async () => {
    const [result] = await pool.query(
        "SELECT * FROM utility_types ORDER BY utility_type_id ASC"
    );
    return result;
};

const getUtilityTypeByID = async (id) => {
    const [result] = await pool.query(
        "SELECT * FROM utility_types WHERE utility_type_id = ?",
        [id]
    );
    return result[0];
};

const createUtilityType = async (body) => {
    const { utility_name, billing_type, unit } = body;

    const [result] = await pool.query(
        "INSERT INTO utility_types (utility_name, billing_type, unit) VALUES (?, ?, ?)",
        [utility_name, billing_type, unit || null]
    );

    return result;
};

const updateUtilityType = async (id, body) => {
    const { utility_name, billing_type, unit } = body;

    const [result] = await pool.query(
        "UPDATE utility_types SET utility_name = ?, billing_type = ?, unit = ? WHERE utility_type_id = ?",
        [utility_name, billing_type, unit, id]
    );

    return result;
};

const deleteUtilityType = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM utility_types WHERE utility_type_id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getUtilityTypes,
    getUtilityTypeByID,
    createUtilityType,
    updateUtilityType,
    deleteUtilityType
};