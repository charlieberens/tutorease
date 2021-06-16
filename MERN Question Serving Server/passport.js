const keys = require('./config/keys')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const mongoose = require('mongoose');

passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
passport.deserializeUser(function(id, done) {
    done(null, id);
});

passport.use(
    new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile)
        const profile_obj = profile._json;
        User.findOneAndUpdate({googleId: profile.id}, {displayName: profile_obj.name, email: profile_obj.email, profileIcon: profile_obj.picture}, {upsert: true, new:true, runValidators: true, useFindAndModify:true}, (err, user) => {
            return cb(err, user);
        });
    }
));