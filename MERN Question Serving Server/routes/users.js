const express = require('express');
const router = express.Router();
const User = require('../models/User');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.sendStatus(401)
}

// ---------------------- Get ----------------------------
// Get user
router.get('/', checkUserLoggedIn, (req, res) => {
	const user_id = req.session.passport.user;
	User.findById(user_id, (err, user) => {
		res.json({
			displayName: user.displayName,
			profileIcon: user.profileIcon,
			description: user.description,
			tutor: user.tutor,
			student: user.student,
			username: user.username,
			startDate: user.startDate
		});
	});
});

// Put
router.put('/put/', (req, res) => {
	const user_id = req.session.passport.user;
	User.findById(user_id, (err, user) => { //Finds Tutor from id and passes it into tutor var
		user = {user, ...req.body};

		user.save() //Saves the set to the database
		.then(data => {
			res.sendStatus(200);
		})
		.catch(err => {
			res.send(err);
		});
	});
})

// Post
router.post('/username/', (req, res) => {
	const user_id = req.session.passport.user;
	const username = req.body.username
	if(username.length < 4 || username.length > 36){
		res.status(400).json({message:"length"})
	}else if(!/^[a-z0-9_\-]+$/.exec(username)){
		res.status(400).json({message:"chars"})
	}else{	
		User.find({username: username}, (err, user) => {
			if(user.length){
				res.status(409).json({message:"taken"})
			}else{
				User.findById(user_id, (err,user) => {
					user.username = username;
					user.save().then(data => {
						res.sendStatus(200);
					})
					.catch(err => {
						res.send(err);
					});
				});
			}
		});
	}
});

router.post('/roles/', (req, res) => {
	const user_id = req.session.passport.user;
	User.findById(user_id, (err, user) => { //Finds Tutor from id and passes it into tutor var
		user.tutor = req.body.tutor;
		user.student = req.body.student;
		if(req.body.tutor && !user.tutorDeets){
			user.tutorDeets = {
				sets: [],
				students: [],
				studentRequests: []
			}
		}
		if(req.body.student && !user.studentDeets){
			user.studentDeets = {
				tutors: [],
				tutorRequests: [],
				blockedTutors: [],
				sets: []
			}
		}
		user.save() 
		.then(data => {
			res.sendStatus(200);
		})
		.catch(err => {
			res.send(err);
		});
	});
})

module.exports = router;