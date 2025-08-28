import mongoose, {Schema} from "mongoose";

const taskCategorySchema = new Schema({
    user : {type : String, required : true},
    categoryName : {type : String, required : true},
    createdAt : {type : Date, default : Date.now},
});

export const TaskCategory = mongoose.models.TaskCategory || mongoose.model("TaskCategory", taskCategorySchema);