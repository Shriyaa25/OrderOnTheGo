const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true },
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
