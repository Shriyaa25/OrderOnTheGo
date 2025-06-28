const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Initialize express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);


// User model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  userType: String
});

const User = mongoose.model("User", userSchema);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running locally!" });
});

// Register route
app.post("/api/users/register", async (req, res) => {
  const { username, email, password, userType } = req.body;

  if (!username || !email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({ username, email, password, userType });
    await user.save();
    res.json({ message: "Registered successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login route
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful ✅", user: { username: user.username, userType: user.userType } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
