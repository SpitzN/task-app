const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = Task = mongoose.model("Task", TaskSchema);
