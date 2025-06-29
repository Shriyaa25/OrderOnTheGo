const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Place an order (from cart)
router.post("/place", async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ error: "User ID and product items are required" });
  }

  try {
    const order = new Order({
      userId,
      products: items
    });

    await order.save();
    res.json({ message: "✅ Order placed successfully!", orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to place order" });
  }
});

// Get user's order history
router.get("/user/:id", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id }).populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch orders" });
  }
});

// Get all orders for a restaurant
router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    const orders = await Order.find({ "products.restaurantId": req.params.restaurantId })
      .populate("userId", "username email")
      .populate("products.productId", "name");

    // Filter to include only products belonging to this restaurant
    const filteredOrders = orders.map(order => ({
      user: order.userId,
      orderedAt: order.orderedAt,
      products: order.products.filter(p => p.restaurantId.toString() === req.params.restaurantId)
    }));

    res.json(filteredOrders);
  } catch (err) {
    console.error("Error fetching restaurant orders:", err);
    res.status(500).json({ error: "Failed to fetch restaurant orders" });
  }
});

// Get total earnings for a restaurant
router.get("/earnings/:restaurantId", async (req, res) => {
  try {
    const orders = await Order.find({ "products.restaurantId": req.params.restaurantId }).populate("products.productId");

    let total = 0;
    orders.forEach(order => {
      order.products.forEach(p => {
        if (p.restaurantId.toString() === req.params.restaurantId) {
          total += p.productId.price;
        }
      });
    });

    res.json({ totalEarnings: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to fetch earnings" });
  }
});



module.exports = router;
