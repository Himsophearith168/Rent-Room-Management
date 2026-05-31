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

module.exports = {
    getUser,
    createTenantByAdmin,
    login,
    updateuser,
    deleteuser,
    getUserByID
};