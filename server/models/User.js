// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Ensure unique index on email
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
