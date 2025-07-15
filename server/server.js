// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

require('dotenv').config();

const authRoutes = require('./routes/auth');
const executeRoute = require("./routes/executeRoute");
const taskRoutes = require("./routes/taskRoutes");




const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files


app.use('/api/auth', authRoutes);
app.use("/api", executeRoute);
app.use("/api/tasks", taskRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

