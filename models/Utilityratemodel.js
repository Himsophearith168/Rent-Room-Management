const pool = require("../config/database");

const getUtilityRates = async () => {
    const [result] = await pool.query(`
        SELECT
            ur.rate_id,
            ur.utility_type_id,
            ut.utility_name,
            ut.billing_type,
            ut.unit,
            ur.unit_price,
            ur.effective_from,
            ur.is_active
        FROM utility_rates ur
        JOIN utility_types ut ON ur.utility_type_id = ut.utility_type_id
        ORDER BY ur.utility_type_id ASC, ur.effective_from DESC
    `);

    return result;
};

const getActiveRates = async () => {
    const [result] = await pool.query(`
        SELECT
            ur.rate_id,
            ur.utility_type_id,
            ut.utility_name,
            ut.billing_type,
            ut.unit,
            ur.unit_price,
            ur.effective_from
        FROM utility_rates ur
        JOIN utility_types ut ON ur.utility_type_id = ut.utility_type_id
        WHERE ur.is_active = TRUE
        ORDER BY ur.utility_type_id ASC
    `);

    return result;
};

/**
 * Get the active rate for a specific utility type.
 */
const getActiveRateByType = async (utility_type_id) => {
    const [result] = await pool.query(`
        SELECT unit_price
        FROM utility_rates
        WHERE utility_type_id = ? AND is_active = TRUE
        LIMIT 1
    `, [utility_type_id]);

    return result[0];
};

const createUtilityRate = async (body) => {
    const { utility_type_id, unit_price, effective_from, is_active } = body;

    // Deactivate old rates for same utility if new one is active
    if (is_active !== false) {
        await pool.query(
            "UPDATE utility_rates SET is_active = FALSE WHERE utility_type_id = ?",
            [utility_type_id]
        );
    }

    const [result] = await pool.query(`
        INSERT INTO utility_rates (utility_type_id, unit_price, effective_from, is_active)
        VALUES (?, ?, ?, ?)
    `, [
        utility_type_id,
        unit_price,
        effective_from,
        is_active !== false ? true : false
    ]);

    return result;
};

const updateUtilityRate = async (id, body) => {
    const { unit_price, effective_from, is_active } = body;

    const [result] = await pool.query(`
        UPDATE utility_rates
        SET unit_price = ?, effective_from = ?, is_active = ?
        WHERE rate_id = ?
    `, [unit_price, effective_from, is_active, id]);

    return result;
};

const deleteUtilityRate = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM utility_rates WHERE rate_id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getUtilityRates,
    getActiveRates,
    getActiveRateByType,
    createUtilityRate,
    updateUtilityRate,
    deleteUtilityRate
};