const pool = require("../config/database");

const getTenant = async () => {
    const [result] = await pool.query("SELECT * FROM tenants ORDER BY fullname ASC");
    return result;
};

const getTenantByID = async (id) => {
    const [result] = await pool.query(
        "SELECT * FROM tenants WHERE tenant_id = ?",
        [id]
    );
    return result[0];
};

const createTenant = async (body) => {
    const {
        fullname,
        gender,
        phone,
        telegram,
        id_card,
        emergency_contact,
        address
    } = body;

    const [result] = await pool.query(
        `INSERT INTO tenants (fullname, gender, phone, telegram, id_card, emergency_contact, address)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            fullname,
            gender || null,
            phone || null,
            telegram || null,
            id_card || null,
            emergency_contact || null,
            address || null
        ]
    );

    return result;
};

const updateTenant = async (id, body) => {
    const {
        fullname,
        gender,
        phone,
        telegram,
        id_card,
        emergency_contact,
        address
    } = body;

    const [result] = await pool.query(
        `UPDATE tenants
         SET fullname = ?, gender = ?, phone = ?, telegram = ?, id_card = ?, emergency_contact = ?, address = ?
         WHERE tenant_id = ?`,
        [fullname, gender, phone, telegram, id_card, emergency_contact, address, id]
    );

    return result;
};

const deleteTenant = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM tenants WHERE tenant_id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getTenant,
    getTenantByID,
    createTenant,
    updateTenant,
    deleteTenant
};