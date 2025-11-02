// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = process.env.COOKIE_NAME || 'claycare_token';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_long_secret';

function signToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    isAdmin: !!user.isAdmin,
    name: user.name
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

async function verifyToken(req, res, next) {
  try {
    const token = req.cookies && req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    const payload = jwt.verify(token, JWT_SECRET);
    // optionally rehydrate from DB
    const user = await User.findById(payload.id).select('-__v');
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      name: user.name
    };
    next();
  } catch (err) {
    console.error('verifyToken error', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { signToken, verifyToken, requireAdmin };
