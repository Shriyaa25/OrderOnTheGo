const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const generateCustomId = require("./utils/generateId"); // 🔹 Import ID generator
dotenv.config();

// Initialize express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
app.use("/api/orders", orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Import User model
const User = require('./models/User');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running locally!" });
});

// ✅ Register route
app.post("/api/users/register", async (req, res) => {
  const { username, email, password, userType, address } = req.body;

  if (!username || !email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 🔹 Generate custom userId (e.g., USER001, RESTAURANT002)
    const userId = await generateCustomId(userType);
    const userData = { userId, username, email, password, userType };

    if (userType === 'restaurant' && address) {
      userData.address = address;
    }

    const user = new User(userData);
    await user.save();
    res.json({ message: "✅ Registered successfully!", userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Server error" });
  }
});

// ✅ Login route with block check
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // 🔹 Admin login check
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return res.json({
      message: "Admin login successful ✅",
      user: {
        username: "Admin",
        userType: "admin",
        id: "ADMIN000"
      }
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔹 Check if user is blocked
    if (user.blockedUntil && new Date(user.blockedUntil) > new Date()) {
      return res.status(403).json({
        error: `⛔ You are blocked until ${new Date(user.blockedUntil).toLocaleString()}`
      });
    }

    res.json({
      message: "Login successful ✅",
      user: {
        username: user.username,
        userType: user.userType,
        id: user._id,          // MongoDB _id
        userId: user.userId    // Custom userId like USER001
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Server error" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ User: Update username
app.put("/api/users/update/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username: req.body.username },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "✅ Username updated", user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "❌ Failed to update username" });
  }
});

// ✅ Get single user by ID (for dashboard)
app.get("/api/users/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
});




