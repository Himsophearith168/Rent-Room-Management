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

const register = async (body) => {
    const { username, email, password, confirm_password } = body;

    if (!username || !email || !password || !confirm_password) {
        throw new Error("All fields are required");
    }

    if (password !== confirm_password) {
        throw new Error("Passwords do not match");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    // Check if user already exists
    const existingUser = await user.checkemail(email);
    if (existingUser.length > 0) {
        throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with Tenant role by default
    const result = await user.createTenantByAdmin({
        username,
        email,
        password: hashedPassword,
        role: "Tenant"
    });

    if (!result.insertId) {
        throw new Error("Failed to create user");
    }

    // Return user info (without password)
    const newUser = await user.displayuserandtoken(result.insertId);
    return newUser;
};

const forgetPassword = async (body) => {
    const { email } = body;

    if (!email) {
        throw new Error("Email is required");
    }

    const userInfo = await user.checkemail(email);
    if (userInfo.length === 0) {
        throw new Error("User not found");
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to user (you'll need to add these fields to user table)
    // For now, just return the token (in production, send via email)
    return {
        reset_token: resetToken,
        message: "In production, this token would be sent via email"
    };
};

const resetPassword = async (body) => {
    const { email, reset_token, new_password, confirm_password } = body;

    if (!email || !reset_token || !new_password || !confirm_password) {
        throw new Error("All fields are required");
    }

    if (new_password !== confirm_password) {
        throw new Error("Passwords do not match");
    }

    if (new_password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    const userInfo = await user.checkemail(email);
    if (userInfo.length === 0) {
        throw new Error("User not found");
    }

    // In production, verify reset token here
    // For now, just update the password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    
    await user.updatePassword(userInfo[0].user_id, hashedPassword);

    return { message: "Password reset successfully" };
};

const logout = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    await user.deleteTokenByUser(userId);
    return { message: "Logged out successfully" };
};

module.exports = {
    login,
    register,
    forgetPassword,
    resetPassword,
    logout
}