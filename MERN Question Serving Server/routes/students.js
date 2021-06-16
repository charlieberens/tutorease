const express = require('express');
const router = express.Router();
const User = require('../models/User');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.sendStatus(401)
}

// Get students from search
router.get('/search/:query_string', checkUserLoggedIn, (req, res) => {
	let query_string = req.params.query_string;
	const user_id = req.session.passport.user;

	const handle_results = async (err, users) => {
		const students = users.filter(user => (user.student && user._id != user_id && !user.studentDeets.tutorRequests.includes(user._id)));
		res.json({students: students});
	}
	if(query_string[0] === '@'){
		query_string = query_string.substring(1);
		User.find({username: {$regex: new RegExp('^' + query_string + '.*$', "ig")}}, {username: 1, _id: 1, displayName: 1, profileIcon: 1, student: 1, studentDeets: 1}, handle_results)
		.limit(10)
		.catch(err => {
			res.send(err);
		});
	}else{
		// User.find({$text: {$search: permutated_query_string}}, {username: 1, _id: 1, displayName: 1, profileIcon: 1, student: 1}, handle_results)
		// .limit(10)
		// .catch(err => {
		// 	res.send(err);
		// });
		User.find({$or: [{displayName: {$regex: new RegExp('^.*' + query_string + '.*$', "ig")}}, {username: {$regex: new RegExp('^.*' + query_string + '.*$', "ig")}}]}, {username: 1, _id: 1, displayName: 1, profileIcon: 1, student: 1, studentDeets: 1}, handle_results)
		.limit(10)
		.catch(err => {
			res.send(err);
		});
	}
});
// Get a tutor's students
router.get('/list-students', (req, res) => {
	console.log('aaaa')
	const user_id = req.session.passport.user;
	User.findById(user_id, (err, tutor_user) => {
		if (err){
			res.sendStatus(400)
		}else{
			if(tutor_user.tutor){
				try{
					console.log('AAAAA ', tutor_user);
					User.find({"_id": {$in: tutor_user.tutorDeets.students}}, {displayName: 1, username: 1, profileIcon: 1, _id: 1}, (err, students) => {			
						res.json({students: students});
					});
				}catch (err){
					return(err)
				}
			}else{
				res.sendStatus(400)
			}
		}
	});
});
// Get a student's tutors
router.get('/list-tutors', (req, res) => {
	const user_id = req.session.passport.user;
	User.findById(user_id, (err, student_user) => {
		if (err){
			res.send(err)
		}else{
			if(student_user.student){
				try{
					User.find({"_id": {$in: student_user.studentDeets.tutors}}, {displayName: 1, username: 1, profileIcon: 1, _id: 1}, (err, tutors) => {			
						res.json({tutors: tutors});
					});
				}catch (err){
					return(err)
				}
			}else{
				res.sendStatus(400)
			}
		}
	});
});

// For students to find tutor requests
router.get('/invite/list-incoming', (req, res) => {
	const user_id = req.session.passport.user;
	User.findById(user_id, async (err, student_user) => {
		try{			
			if (err){
				res.sendStatus(400)
			}else{
				if(student_user.student){
					let res_json = {
						requests: await User.find({"_id": {$in: student_user.studentDeets.tutorRequests}}, {displayName: 1, username: 1, profileIcon: 1, _id: 1}),
						blocked: await User.find({"_id": {$in: student_user.studentDeets.blockedTutors}}, {displayName: 1, username: 1, profileIcon: 1, _id: 1})
					}
					res.json(res_json);
				}else{
					res.sendStatus(400)
				}
			}
		}catch(err){
			res.send(err)
		}
	});
});
// For tutors to see their student requests
router.get('/invite/list-outgoing', (req, res) => {
	const user_id = req.session.passport.user;
	User.findById(user_id, (err, tutor_user) => {
		if (err){
			res.sendStatus(400)
		}else{
			let studentArr = []
			User.find({"_id": {$in: tutor_user.tutorDeets.studentRequests}}, {displayName: 1, username: 1, profileIcon: 1, _id: 1}, (err, students) => {			
				res.json({requests: students});
			});
		}
	});
});

// Post
router.post('/invite/:student_id', (req, res) => {
	const student_id = req.params.student_id;
	const tutor_id = req.session.passport.user;

	User.findById(student_id, (err, student_user) => {
		if(!student_user.studentDeets.tutorRequests.includes(tutor_id) && !student_user.studentDeets.tutors.includes(tutor_id) && !student_user.studentDeets.blockedTutors.includes(tutor_id)){
			student_user.studentDeets.tutorRequests.push(tutor_id);
			User.findById(tutor_id, (err, tutor_user) => {
				tutor_user.tutorDeets.studentRequests.push(student_id);
				tutor_user.save();
			});
			student_user.save().then(data =>{
				res.sendStatus(201)
			}).catch(err =>{
				res.sendStatus(400)
			});
		}
	});
});
router.post('/invite/accept/:tutor_id', (req, res) => {
	const user_id = req.session.passport.user;
	const tutor_id = req.params.tutor_id;
	User.findById(user_id, (err, student_user) => {
		const tutorRequestsIndex = student_user.studentDeets.tutorRequests.indexOf(tutor_id);
		if(tutorRequestsIndex > -1){
			student_user.studentDeets.tutors.push(tutor_id);
			student_user.studentDeets.tutorRequests.splice(tutorRequestsIndex, 1);
			User.findById(tutor_id, (err, tutor_user) => {
				const studentRequestsIndex = tutor_user.tutorDeets.studentRequests.indexOf(user_id);
				if(studentRequestsIndex > -1){
					tutor_user.tutorDeets.students.push(user_id);
					tutor_user.tutorDeets.studentRequests.splice(studentRequestsIndex, 1);
					tutor_user.save().catch(err => {
						res.sendStatus(400);
					})
				}else{
					res.sendStatus(400);
				}
			});
			student_user.save().then(data => {
				res.sendStatus(200)
			}).catch(err => {
				res.sendStatus(400);
			})
		}else{
			res.sendStatus(400);
		}
	});
});
router.post('/assign/:student_id/:set_id', (req, res) => {
	const user_id = req.session.passport.user;
	const student_id = req.params.student_id;
	const set_id = req.params.set_id;
	User.findById(user_id, (err, tutor_user) => {
		if(tutor_user.tutorDeets.students.includes(student_id)){
			User.findById(student_id, (err, tutor_user) => {
				if(!(tutor_user.tutorDeets.sets.some(set => set._id === set_id))){
					res.sendStatus(400);
				}
			});
			const set = {
				tutorId: tutor_id,
				setId: set_id,
				numAnswered: 0
			}
			student_user.studentDeets.sets.push(set);
			student_user.save().then(data => {
				res.sendStatus(200);
			})
			.catch(err => {
				res.send(err);
			});
		}
	});
});

module.exports = router;