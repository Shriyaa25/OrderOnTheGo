const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path if needed
const bcrypt = require('bcryptjs');

// REGISTER route
router.post('/register', async (req, res) => {
  const { username, email, password, userType } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, userType });
    await newUser.save();

    res.json({ message: "Registered successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

// LOGIN route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful ✅",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
