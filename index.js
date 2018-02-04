// Require express
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const authRoutes = require('./routes/authRoutes')

// Make sure the require order is correct
require('./models/User');
require('./services/passport');

// Connect Mongoose JS with MongoDB
mongoose.connect(keys.mongoURI);

// Generate a new application, setup a new configuration to route requests
const app = express();

app.use(
  cookieSession({
    // I want this cookie to last 30 days
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);

// Watch for incoming requests
// app.get('/', (req, res) => {
//  res.send({ bye: 'there' });
// });

// Look and see what port Heroku gave us in PROD
// By default, just use 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT);
