const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true }, // 🔹 Custom ID like USER001 or RESTAURANT001
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['user', 'restaurant'], default: 'user' },
  address: { type: String }, // Only applicable for restaurants
  blockedUntil: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
