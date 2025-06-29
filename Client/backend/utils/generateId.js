const Counter = require("../models/Counter");

const generateCustomId = async (type) => {
  const counter = await Counter.findOneAndUpdate(
    { name: type },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const prefix = type.toUpperCase();
  const padded = String(counter.seq).padStart(3, '0');
  return `${prefix}${padded}`;  
};

module.exports = generateCustomId;
