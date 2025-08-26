import mongoose, { Schema } from "mongoose";

const loggedInTasksSchema = new Schema({
  user: { type: String, required: true },
  category: { type: String, default: "General" },
  taskName: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  priority: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const LoggedInTasks =
  mongoose.models.LoggedInTasks ||
  mongoose.model("LoggedInTasks", loggedInTasksSchema);
