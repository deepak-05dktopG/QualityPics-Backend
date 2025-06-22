// backend/config/db.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ Connection error:", error.message);
    process.exit(1); // Stop the app if DB fails
  }
};

module.exports = connectDB;
