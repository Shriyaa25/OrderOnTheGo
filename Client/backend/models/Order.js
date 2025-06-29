const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }
  ],
  orderedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
