const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const crypto = require('crypto');
// const { userInfo } = require('os');


const login = async (body) => {
    const { email, password } = body;
    console.log(`Login attempt for email: ${email}`);

    const userInfo = await user.checkemail(email);

    if (userInfo.length === 0) {
        throw new Error("Incorrect Password or Email");
    }

    const isMatch = await bcrypt.compare(password, userInfo[0].password);

    if (!isMatch) {
        throw new Error("Incorrect Password or Email");
    }
  
    const token = jwt.sign(
        { 
            id: userInfo[0].user_id, 
            email: userInfo[0].email,
            role: userInfo[0].role 
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expireIn }
    );


    await user.deleteTokenByUser(userInfo[0].user_id);


    await user.addToken(userInfo[0].user_id, token);


    const data = await user.displayuserandtoken(userInfo[0].user_id);

    return data;
};

module.exports = {
    login
}