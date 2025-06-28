const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// POST: Add a new product
router.post("/add", async (req, res) => {
  const { name, description, price, image, restaurant, category } = req.body;
  try {
    const product = new Product({ name, description, price, image, restaurant, category });
    await product.save();
    res.json({ message: "Product added successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// GET: Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;
