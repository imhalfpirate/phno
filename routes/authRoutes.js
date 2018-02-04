const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    // GoogleStrategy has the google string
    passport.authenticate('google', {
      // We're asking for the users profile and email
      scope: ['profile', 'email']
    })
  );

  // Google will h ave the parameters in this callback
  app.get('/auth/google/callback', passport.authenticate('google'));

  // Kill the cookie and log them out
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
  });

  // Can you get the user
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};

