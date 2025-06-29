const express = require('express');
const router = express.Router(); // <-- This is missing in your code
const Product = require('../models/Product');

const generateCustomId = require("../utils/generateId");

router.post('/add', async (req, res) => {
  const { name, description, price, category, imageUrl, restaurant } = req.body;

  if (!name || !price || !restaurant) {
    return res.status(400).json({ error: "Name, price and restaurant ID are required" });
  }

  try {
    const productId = await generateCustomId("product");
    const product = new Product({
      productId,
      name,
      description,
      price,
      category,
      imageUrl,
      restaurant
    });

    await product.save();
    res.json({ message: "✅ Product added successfully!", productId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Server error" });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to delete product" });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "✅ Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to update product" });
  }
});

// Get all products of a restaurant
router.get('/restaurant/:id', async (req, res) => {
  try {
    const products = await Product.find({ restaurant: req.params.id });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to load products" });
  }
});

// Most reviewed/popular dishes
router.get("/popular", async (req, res) => {
  try {
    const products = await Product.find().sort({ reviews: -1 }).limit(6);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to load popular dishes" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search, category, maxPrice } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});





module.exports = router;
