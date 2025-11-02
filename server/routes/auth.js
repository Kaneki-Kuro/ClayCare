// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { signToken } = require('../middleware/auth');

const COOKIE_NAME = process.env.COOKIE_NAME || 'claycare_token';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Kick off Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// OAuth callback
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: CLIENT_URL + '/login?fail=1' }), (req, res) => {
  // req.user is the mongoose user
  const token = signToken(req.user);
  // set HTTP-only cookie
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  // redirect to frontend (you can include a query param)
  return res.redirect(CLIENT_URL + '/?auth=success');
});

// logout: clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true });
});

module.exports = router;
