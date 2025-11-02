// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Public: list all
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin only: create product
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, price, imageUrl } = req.body;
    if (!title || price == null) return res.status(400).json({ error: 'title and price required' });
    const product = new Product({ title, description, price, imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin only: update
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin only: delete
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
