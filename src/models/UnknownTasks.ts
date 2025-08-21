import mongoose, { Schema } from "mongoose";

const unknownTasksSchema = new Schema({
  taskName: { type: String, required: false },
  isCompleted: { type: Boolean, default: false },
  priority: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const UnknownTasks =
  mongoose.models.UnknownTasks ||
  mongoose.model("UnknownTasks", unknownTasksSchema);
