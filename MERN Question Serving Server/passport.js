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

console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID)
console.log("DB_URI", process.env.DB_URI)

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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