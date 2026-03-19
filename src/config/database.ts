import mongoose from "mongoose";

export const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
