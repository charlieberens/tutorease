const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const User = require('../models/User')

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

router.get('/google', passport.authenticate('google', {
	scope: ["profile", "email"]
}));

router.get("/google/callback",passport.authenticate("google", {failureRedirect: '/google'}),(req,res)=>{
	// console.log({req, res});
	 // res.send(req.user);
	res.redirect('/app/')
});

router.get("/logout", (req,res) => {
	req.session = null;
	req.logout();
	res.redirect('/');
});


// // const express = require('express');
// // const router = express.Router();

// // const mongoose = require('mongoose');
// // const bodyParser = require('body-parser');

module.exports = router;