// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // profile.emails is an array, use first
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    if (!email) return done(new Error('No email in Google profile'));

    // find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        googleId: profile.id,
        email,
        name: profile.displayName,
        isAdmin: email === ADMIN_EMAIL
      });
    } else {
      // update admin flag in case admin email changed in env
      user.isAdmin = (email === ADMIN_EMAIL);
      user.googleId = user.googleId || profile.id;
      user.name = user.name || profile.displayName;
    }
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));
