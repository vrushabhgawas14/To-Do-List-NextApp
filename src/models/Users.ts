import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true },
  image: { type: String, required: false, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
