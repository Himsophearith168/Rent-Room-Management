const pool = require("../config/database");



const checkemail = async (email) => {
    const [emaildata] = await pool.query(
        `SELECT user_id, username, email, password, role 
         FROM users 
         WHERE email = ?`,
        [email]
    );
    return emaildata;
};



const getUser = async () => {
    const [data] = await pool.query('SELECT * FROM users');
    return data;
};


const getUserByID = async (id) => {
    const [data] = await pool.query(
        `SELECT user_id, username, email, role 
         FROM users 
         WHERE user_id = ?`,
        [id]
    );
    return data;
};

const displayuserandtoken = async (id) => {
    const [data] = await pool.query(
        `SELECT 
            u.user_id,
            u.username,
            u.email,
            u.role,
            t.token
         FROM users u
         LEFT JOIN user_tokens t 
         ON u.user_id = t.user_id
         WHERE u.user_id = ?`,
        [id]
    );

    return data;
};
const deleteTokenByUser = async (user_id) => {
    await pool.query(
        `DELETE FROM user_tokens WHERE user_id = ?`,
        [user_id]
    );
};


const createTenantByAdmin = async (body) => {
    const role = body.role || 'Admin';
    const dataarr = [body.username, body.email, body.password, role];

    const [data] = await pool.query(
        `INSERT INTO users (username, email, password, role)
         VALUES (?, ?, ?, ?)`,
        dataarr
    );

    return data.insertId;
};

const updateUser = async (id, body) => {
    const { username, email, role, password } = body;

    let query = `UPDATE users SET username = ?, email = ?, role = ?`;
    let params = [username, email, role];

    if (password) {
        query += `, password = ?`;
        params.push(password);
    }

    query += ` WHERE user_id = ?`;
    params.push(id);

    const [result] = await pool.query(query, params);

    return result.affectedRows; 
};

const deleteuser = async (id) =>{
    const [result] = await pool.query(`DELETE FROM users WHERE user_id = ?`,[id])
    return result
}


const addToken = async (user_id, token) => {
    const [data] = await pool.query(
        `INSERT INTO user_tokens (user_id, token)
         VALUES (?, ?)`,
        [user_id, token]
    );

    return data.insertId;
};


const findById = async (id) => {
    const [data] = await pool.query(
        `SELECT user_id, username, email, role 
         FROM users 
         WHERE user_id = ?`,
        [id]
    );
    return data;
};



const findToken = async (token) => {
    const [data] = await pool.query(
        `SELECT * FROM user_tokens WHERE token = ?`,
        [token]
    );
    return data;
};



const deleteToken = async (token) => {
    const [data] = await pool.query(
        `DELETE FROM user_tokens WHERE token = ?`,
        [token]
    );
    return data;
};

const updatePassword = async (userId, hashedPassword) => {
    const [result] = await pool.query(
        `UPDATE users SET password = ? WHERE user_id = ?`,
        [hashedPassword, userId]
    );
    return result.affectedRows;
};

module.exports = {
    getUser,
    getUserByID,
    checkemail,
    createTenantByAdmin,
    addToken,
    findById,
    findToken,
    deleteToken,
    updateUser,
    deleteuser,
    displayuserandtoken,
    deleteTokenByUser,
    updatePassword
};