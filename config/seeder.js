const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
    try {
        console.log("Checking for Admin account...");
        const email = process.env.ADMIN_EMAIL || "dmin@gmail.com";
        const password = process.env.ADMIN_PASSWORD || "admin123";
        const username = process.env.ADMIN_USERNAME || "admin";

        const existingUsers = await userModel.checkemail(email);

        if (existingUsers.length === 0) {
            console.log(`No account found with email ${email}. Seeding new Admin...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            await userModel.createTenantByAdmin({
                username,
                email,
                password: hashedPassword,
                role: "Admin"
            });
            console.log("Admin account seeded successfully.");
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        } else {
            console.log(`Account with email ${email} already exists.`);
            const user = existingUsers[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                console.log("Password mismatch detected. Updating password for Admin to match .env...");
                const hashedPassword = await bcrypt.hash(password, 10);
                await userModel.updateUser(user.user_id, {
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    password: hashedPassword
                });
                console.log("Admin password updated successfully.");
            } else {
                console.log("Admin credentials are correct.");
            }
        }
    } catch (error) {
        console.error("Error seeding Admin account:", error.message);
    }
};

module.exports = { seedAdmin };
