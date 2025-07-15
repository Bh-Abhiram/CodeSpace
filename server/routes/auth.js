const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendVerificationMail = require("../utils/sendVerificationMail");
const sendEmail = require("../utils/sendEmail"); 

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = new User({ name, email, password: hashed, verificationToken });
    await user.save();

    await sendVerificationMail(email, verificationToken);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Signup successful. Verification email sent.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (err) {
    console.error("❌ Error in signup:", err);
    res.status(500).json({ message: 'Signup failed' });
  }
});


// server/routes/auth.js

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).send("Invalid or expired token.");

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send(`
  <html>
    <head>
      <title>Email Verified</title>
      <style>
        body { font-family: sans-serif; background: #f9f9f9; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center; }
        a { display: inline-block; margin-top: 1rem; color: #2563eb; text-decoration: none; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>✅ Email Verified</h1>
        <p>Your email has been successfully verified.</p>
        <a href="http://localhost:3000/">🔑 Back to Login</a>
      </div>
    </body>
  </html>
`);
  } catch (err) {
    res.status(500).send("Server error during verification.");
  }
});


// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });
     if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }
    res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/auth.js
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    await sendEmail(user.email, 'Reset your password', `Click here to reset: ${resetUrl}`);

    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/reset-password/:token', async (req, res) => {
    const { newPassword } = req.body;
    const token = req.params.token;  
    try {
      const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password." });
  }
});


module.exports = router;
