const express = require('express');
const router = express.Router();
const User = require('../models/User');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const common = require('../common_functions.js')

const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.sendStatus(401)
}

// Get students from search
router.get('/search/:query_string', checkUserLoggedIn, (req, res) => {
	let query_string = req.params.query_string;
	const user_id = req.session.passport.user;

	const handle_results = async (err, users) => {
		const students = users.filter(user => (user.student && user._id != user_id && !user.studentDeets.tutorRequests.includes(user_id) && !user.studentDeets.tutors.includes(user_id)));
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
	const user_id = req.session.passport.user;
	User.findById(user_id, (err, tutor_user) => {
		if (err){
			res.sendStatus(400)
		}else{
			if(tutor_user.tutor){
				try{
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
// Get sets assigned to a student
router.get('/sets', async (req, res) => {
	const user_id = req.session.passport.user;
	User.findById(user_id, async (err, student_user) => {
		const sets = student_user.studentDeets.sets;
		let incomplete = []
		let tutor_set_obj = {}
		let embiggened_sets = []
		sets.forEach(set => {
			if(tutor_set_obj[set.tutorId]){
				tutor_set_obj[set.tutorId].push(set.setId.toString());
			}else{
				tutor_set_obj[set.tutorId] = [set.setId.toString()];
			}
		})

		for await (let tutor_id of Object.keys(tutor_set_obj)){
			await User.findById(tutor_id, (err, tutor_user) => {
				for(let i=0; i<tutor_user.tutorDeets.sets.length; i++){				
					if(tutor_set_obj[tutor_id].includes(tutor_user.tutorDeets.sets[i]._id.toString())){
						let set = tutor_user.tutorDeets.sets[i];
						embiggened_sets.push({
							title: set.title,
							setLength: (set.questions ? set.questions.length : 0),
							tutorUsername:  tutor_user.username,
							tutorDisplayName:  tutor_user.displayName,
							setId: set._id,
							numAnswered: sets.find(qset => qset.setId.toString() === set._id.toString()).questions.filter(question => question.responses.length).length
						});
					}
				}
			})
		}

		res.json({
			incomplete: embiggened_sets.filter(set => set.numAnswered < set.setLength),
			complete: embiggened_sets.filter(set => set.numAnswered >= set.setLength)
		})
	}).catch(err => {
		res.send(err);
	});
});
router.get('/set/:set_id', (req, res) => {
	const user_id = req.session.passport.user;
	const set_id = req.params.set_id;
	User.findById(user_id, (err, student_user) => {
		try{
			if(student_user.student){
				const student_set = student_user.studentDeets.sets.find(set => set.setId.toString() === set_id.toString());
				User.findById(student_set.tutorId, (err, tutor_user) => {
					const tutor_set = tutor_user.tutorDeets.sets.find(set => set._id.toString() === set_id.toString());
					console.log({student_set: student_set.questions[0].responses})
					console.log({tutor_set: tutor_set.questions})
					res.json({
						completed: (tutor_set.questions.length <= student_set.questions.filter(question => question.responses.length).length),
						numAnswered: student_set.questions.filter(question => question.responses?.length).length,
						id: tutor_set._id,
						questions: tutor_set.questions.map((question, index) => ({
							body: question.body,
							mcq: question.mcq,
							answers: common.shuffle(question.answers),
							responses: student_set.questions[index].responses
						})),
						title: tutor_set.title,
						description: tutor_set.description,
						date: tutor_set.date,
						tutorIcon: tutor_user.profileIcon,
						tutorName: tutor_user.displayName,
						tutorUsername: tutor_user.username
					}) 
				}).catch(err =>{
					res.send(err);
				});
			}else{
				res.sendStatus(400)
			}
		}catch(err){
			res.send(err)
		}
	});
});
router.get('/check/:set_id/:question_index', (req, res) => {
	try{
		const user_id = req.session.passport.user;
		const set_id = req.params.set_id;
		const question_index = req.params.question_index;
		const answer = req.query.answer;

		User.findById(user_id, (err, student_user) => {
			if(!student_user.studentDeets.sets.find(set => set.setId.toString() == set_id.toString()).completeDate){
				student_user.studentDeets.sets.find(set => set.setId.toString() === set_id.toString()).questions[question_index].responses.push(answer);
				User.findById(student_user.studentDeets.sets.find(set => set.setId.toString() === set_id.toString()).tutorId, (err, tutor_user) => {
					const correct_answer = tutor_user.tutorDeets.sets.find(set => set._id.toString() === set_id.toString()).questions[question_index].answers[0];
					student_user.save();
					if(answer===correct_answer && student_user.studentDeets.sets.find(set => set.setId.toString() == set_id.toString()).questions.filter(question => question.responses).length == student_user.studentDeets.sets.find(set => set.setId.toString() === set_id.toString()).setLength){
						// If just completed
						student_user.studentDeets.sets.find(set => set.setId.toString() == set_id.toString()).completeDate = new Date();
					}
					res.json({
						success: answer === correct_answer,
						responses: student_user.studentDeets.sets.find(set => set.setId.toString() === set_id.toString()).questions[question_index].responses
					});
				});
			}else{
				res.send('Already Completed')
			}
		});
	}catch(err){
		res.send(err)
	}
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
router.post('/assign/:student_ids/:set_id', (req, res) => {
	const user_id = req.session.passport.user;
	const student_ids = req.params.student_ids.split(',');
	const set_id = req.params.set_id;
	User.findById(user_id, (err, tutor_user) => {
		const set = {
			tutorId: user_id,
			setId: set_id,
			setLength: tutor_user.tutorDeets.sets.find(qset => qset._id == set_id).questions.length,
			numAnswered: 0,
			questions: Array(tutor_user.tutorDeets.sets.find(qset => qset._id == set_id).questions.length).fill({responses: []})
		}
		if(!set.setLength){
			res.status(400).json({err: 'Set must not be empty'});
		}else{
			try{
				for(student_id of student_ids){
					if(tutor_user.tutorDeets.students.includes(student_id)){
						User.findById(student_id, (err, student_user) => {
							// if(tutor_user.tutorDeets.sets.some(set => set._id === set_id)){
							if(!student_user.studentDeets.sets.filter(qset => qset.setId == set_id).length){//Only adds set if set not already present
								student_user.studentDeets.sets.push(set);
								student_user.save().catch(err => console.log(err));
							}
							// }
						});
					}
				}
				// Verbose code that updates the assigned student (student) field for the set
				const students = tutor_user.tutorDeets.students;
				const assignedStudents = tutor_user.tutorDeets.sets.find(qset => qset._id == set_id).students;
				const valid_students = student_ids.filter(student_id => {
					return students.includes(student_id)
				});
				const new_students = valid_students.filter(student_id => {
					return !assignedStudents.includes(student_id)
				})
				tutor_user.tutorDeets.sets.find(qset => qset._id == set_id).students.push(...new_students);
				tutor_user.save();
				res.sendStatus(200);
			}catch(err){
				console.log({2: err})
				res.send(err)
			}
		}
	}).catch(err =>{
		console.log({1: err})
		send(err);
	})
});

module.exports = router;