const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");

// Stats
router.get("/stats", async (req, res) => {
  try {
    const users = await User.find({ userType: "user" });
    const restaurants = await User.find({ userType: "restaurant" });
    res.json({ userCount: users.length, restaurantCount: restaurants.length });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// All users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ userType: "user" });
    res.json(users);
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// All restaurants
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await User.find({ userType: "restaurant" });
    res.json(restaurants);
  } catch {
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

// Products by restaurant
router.get("/products/:restaurantId", async (req, res) => {
  try {
    const products = await Product.find({ restaurant: req.params.restaurantId });
    res.json(products);
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Block user
router.post("/block/:userId", async (req, res) => {
  const { hours = 1 } = req.body;
  try {
    const blockedUntil = new Date(Date.now() + hours * 3600000);
    await User.findByIdAndUpdate(req.params.userId, { blockedUntil });
    res.json({ message: `User blocked for ${hours} hour(s)` });
  } catch {
    res.status(500).json({ error: "Failed to block user" });
  }
});

// Unblock user
router.post("/unblock/:userId", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { blockedUntil: null });
    res.json({ message: "User unblocked" });
  } catch {
    res.status(500).json({ error: "Failed to unblock user" });
  }
});

// Delete user/restaurant
router.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

router.delete('/delete-user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to delete user" });
  }
});

router.get("/restaurants/popular", async (req, res) => {
  try {
    const restaurants = await User.find({ userType: "restaurant" }).sort({ reviews: -1 }).limit(5);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: "Failed to load popular restaurants" });
  }
});

const Order = require("../models/Order");

// Get all orders with user and restaurant info
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .populate("products.productId", "name")
      .populate("products.restaurantId", "username email");

    res.json(orders);
  } catch (err) {
    console.error("Admin order fetch error:", err);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
});

// Get all orders with user and restaurant info
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .populate("products.productId", "name price")
      .populate("products.restaurantId", "username email");

    res.json(orders);
  } catch (err) {
    console.error("Admin order fetch error:", err);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
});





module.exports = router;
