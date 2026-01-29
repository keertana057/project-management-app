import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./src/models/User.models.js";

dotenv.config();

const users = [
    {
        name: "Admin User",
        email: "admin@company.com",
        password: "password123",
        role: "ADMIN",
    },
    {
        name: "Project Manager",
        email: "pm@company.com",
        password: "password123",
        role: "PROJECT_MANAGER",
    },
    {
        name: "Employee User",
        email: "employee@company.com",
        password: "password123",
        role: "EMPLOYEE",
    },
    {
        name: "Demo User",
        email: "you@company.com",
        password: "password123",
        role: "EMPLOYEE",
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("📦 Connected to MongoDB");

        for (const user of users) {
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await User.create({ ...user, password: hashedPassword });
                console.log(`✅ Created user: ${user.email}`);
            } else {
                console.log(`ℹ️ User already exists: ${user.email}`);
            }
        }

        console.log("🎉 Seeding complete");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
};

seedDB();
