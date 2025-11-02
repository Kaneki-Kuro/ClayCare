// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
