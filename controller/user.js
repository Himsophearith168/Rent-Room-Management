const userService = require('../services/user');
const authService = require('../services/auth');

const getUser = async (req, res) => {
    try {
        const result = await userService.getUser();
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getUserByID = async (req, res) => {
    try {
        const result = await userService.getUserbyID(req.params.id);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "User not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateuser = async (req, res) => {
    try {
        const result = await userService.updateuser(req.params.id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(error.message === "User not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteuser = async (req, res) => {
    try {
        await userService.deleteuser(req.params.id);
        return res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        return res.status(error.message === "User not found" ? 404 : 400).json({
            success: false,
            message: error.message
        });
    }
};

const createTenantByAdmin = async (req, res) => {
    try {
        const result = await userService.createTenantByAdmin(req.body);
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

const register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const result = await authService.forgetPassword(req.body);
        return res.json({
            success: true,
            message: "Password reset link sent to your email",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const result = await authService.resetPassword(req.body);
        return res.json({
            success: true,
            message: "Password reset successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const logout = async (req, res) => {
    try {
        await authService.logout(req.user.id);
        return res.json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getUser,
    createTenantByAdmin,
    login,
    register,
    forgetPassword,
    resetPassword,
    logout,
    updateuser,
    deleteuser,
    getUserByID
};