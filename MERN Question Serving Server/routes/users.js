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
			bio: user.bio,
			description: user.description,
			tutor: user.tutor,
			student: user.student,
			username: user.username,
			startDate: user.startDate,
		});
	});
});

// Get user profile
router.get('/profile/:username', async (req,res) => {
	const user_id = req.session?.passport?.user;
	const username = req.params.username;
	try{
		const requesting_user = await User.findById(user_id);
		const user = await User.findOne({username: username});
		if(user){
			res.json({
				id: user._id,
				profileIcon: user.profileIcon,
				displayName: user.displayName,
				bio: user.bio,
				tutor: user.tutor,
				student: user.student,
				pendingStudent: requesting_user?.tutorDeets?.studentRequests?.includes(user._id),
				currentStudent: requesting_user?.tutorDeets?.students?.includes(user._id),
				startDate: user.startDate,
				isCurrentUser: user._id.toString() === user_id.toString()
			})
		}else{
			res.send({err: 'User does not exist!'})
		}
	}catch(err){
		res.statusCode(400).send({err: err.toString()});
	}
});

// Put
router.post('/put/', async (req, res) => {
	const user_id = req.session.passport.user;

	const verifyUsername = async (username, current_username) => {
		if(username === current_username){
			return ({})
		}else{		
			return new Promise(async (resolve, reject) => {
				if(username.length < 4 || username.length > 36){
					resolve({err: "Username must be between 4 and 36 characters"})
				}else if(!/^[a-z0-9_\-]+$/.exec(username)){
					resolve({err: "Username may only contain letters A-Z, numbers 0-9, -, and _"})
				}else{	
					await User.find({username: username}, (err, temp_users) => {
						if(temp_users.length){
							resolve({err: "Username already taken"})
						}else{
							resolve({})
						}
					});
				}
			});
		}
	}

	const verifyDisplayName = displayName => {
		if(displayName.length > 73){
			return({err: "That username is really long. Maybe make it less so."})
		}else{
			return({})
		}
	}

	const verifyBio = bio => {
		if(bio.length > 512){
			return({err: "Bio must not be more than 512 characters"})
		}else{
			return({})
		}
	}

	User.findById(user_id, async (err, user) => { //Finds Tutor from id and passes it into tutor var
		req.body.displayName = req.body.displayName?.trim();
		if(req.body.username){
			const username_verification = await verifyUsername(req.body.username, user.username);
			if(username_verification.err){
				res.status(400).json(username_verification);
				return {err: 'username'}
			}else{
				user.username = req.body.username;
			}
		}
		if(req.body.displayName){
			const display_name_verification = verifyDisplayName(req.body.displayName);
			if(display_name_verification.err){
				res.status(400).json(display_name_verification);
				return {err: 'username'}
			}else{
				user.displayName = req.body.displayName
			}
		}
		if(req.body.bio){
			const bio_verification = verifyBio(req.body.bio);
			if(bio_verification.err){
				res.status(400).json(bio_verification);
				return {err: 'username'}
			}else{
				user.bio = req.body.bio
			}
		}

		if(req.body.student || req.body.tutor){
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

// Post

module.exports = router;