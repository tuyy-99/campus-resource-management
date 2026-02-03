/**
 * One-time script to create or promote an admin user.
 * Usage: npm run create-admin
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD in .env
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../src/models/User";

dotenv.config();

const email = process.env.ADMIN_EMAIL;
const name = process.env.ADMIN_NAME ?? "Admin";
const password = process.env.ADMIN_PASSWORD;

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is required");
    process.exit(1);
  }

  if (!email || !password) {
    console.error("❌ Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");

  const existingUser = await User.findOne({ email }).select("+password");

  if (existingUser) {
    if (existingUser.role === "ADMIN") {
      console.log("ℹ️ Admin already exists:", email);
    } else {
      existingUser.role = "ADMIN";
      await existingUser.save();
      console.log("✅ Existing user promoted to admin:", email);
    }
  } else {
    await User.create({
      name,
      email,
      password, // plain password, schema will hash it
      role: "ADMIN",
    });

    console.log("✅ Admin user created:", email);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Failed to create admin:", error);
  process.exit(1);
});
