import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
  console.log("Connected DB:", mongoose.connection.name);
};

export default connectDB;
