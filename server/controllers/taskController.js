const Submission = require("../models/Submission");
const path = require("path");

exports.submitSolution = async (req, res) => {
  try {
    const { level, taskId, user } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No PDF file uploaded." });
    }

    const submission = new Submission({
      user,
      level,
      taskId,
      filePath: `/uploads/${file.filename}`
    });

    await submission.save();

    res.status(200).json({
      message: "🎉 Solution submitted successfully!",
      submission
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Server error." });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const { user } = req.params;

    const submissions = await Submission.find({ user });

    res.status(200).json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Failed to fetch submissions." });
  }
};
