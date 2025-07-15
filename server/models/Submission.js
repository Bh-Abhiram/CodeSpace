const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user: { type: String, required: true }, 
  level: { type: String, required: true }, 
  taskId: { type: Number, required: true },
  filePath: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", submissionSchema);
