const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// Create a serial for the new user, mmkay?
// user id is not the google id, but the mongo generated id
passport.serializeUser((user,done) => {
  done(null, user.id);
});

// Search for users and after we find user, call done
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
})

// New Instance, pass in configuration
passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, (accessToken, refreshToken, profile, done) => {
      // oAuth Google Vars
      // console.log(accessToken);
      // console.log(refreshToken);
      // console.log(profile);

      // Get the info and put it into our DB
      // Profile ID is coming from google oAuth
      // Find if the userID already exists
      User.findOne({ googleId: profile.id})
        .then((existingUser) => {
          if(existingUser) {
            // We already have a record with the given ID
            // the first argument null is used if there was an error
            done(null, existingUser);
          } else {
            // Add a new user
            new User({
              googleId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName
            })
              .save()
              .then(user => done(null, user));
          }
      })
  })
);



// // New Instance, pass in configuration
// passport.use(
//   new GoogleStrategy({
//     clientID: keys.googleClientID,
//     clientSecret: keys.googleClientSecret,
//     callbackURL: '/auth/google/callback'
//   }, (accessToken, refreshToken, profile, done) => {

//     // oAuth Google Vars
//     // console.log(accessToken);
//     // console.log(refreshToken);
//     // console.log(profile);


//     // Get the info and put it into our DB
//     // Profile ID is coming from google oAuth
//     new User({
//       googleId: profile.id,
//       firstName: profile.name.givenName,
//       lastName: profile.name.familyName
//     }).save();

//   })
// );
