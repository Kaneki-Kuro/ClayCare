// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

require('./config/passport'); // configure passport

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS: allow frontend origin and allow cookies
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

app.use(passport.initialize());

// connect to Mongo
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>console.log('MongoDB connected'))
  .catch(err => { console.error('Mongo connect error', err); process.exit(1); });

app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);

// protected helper: returns current user info from cookie token
const { verifyToken } = require('./middleware/auth');
app.get('/api/me', verifyToken, (req, res) => {
  // req.user is populated by verifyToken
  res.json({ user: req.user });
});

app.get('/', (req, res) => res.send('ClayCare store API is running'));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
