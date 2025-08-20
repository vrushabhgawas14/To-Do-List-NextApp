import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL!);
      // console.log(`Connection Successfull!`);
    }
  } catch {
    console.log("Connection Unsuccessfull!");
  }
};
