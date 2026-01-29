import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./src/models/User.models.js";

dotenv.config();

const pms = [
    {
        name: "Project Manager A",
        email: "pm.a@company.com",
        password: "password123",
        role: "PROJECT_MANAGER",
    },
    {
        name: "Project Manager B",
        email: "pm.b@company.com",
        password: "password123",
        role: "PROJECT_MANAGER",
    },
    {
        name: "Project Manager C",
        email: "pm.c@company.com",
        password: "password123",
        role: "PROJECT_MANAGER",
    },
];

const seedPMs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("📦 Connected to MongoDB");

        for (const pm of pms) {
            const existingUser = await User.findOne({ email: pm.email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(pm.password, 10);
                await User.create({ ...pm, password: hashedPassword });
                console.log(`✅ Created PM: ${pm.name}`);
            } else {
                console.log(`ℹ️ PM already exists: ${pm.name}`);
            }
        }

        console.log("🎉 PM Seeding complete");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
};

seedPMs();
