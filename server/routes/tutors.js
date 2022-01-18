const express = require('express');
const router = express.Router();
const User = require('../models/User');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.sendStatus(401)
}

// ---------------------- Get ----------------------------
// Get tutor
router.get('/', async (req, res) => {
	try{
		const user_id = req.session.passport.user;
		const user = await User.findById(user_id);
		if(!user.tutor){
			res.sendStatus(400)
		}else{
			res.json(user.tutorDeets)
		}
	}catch(err){
		res.status(400).send(err)
	}
});

// Get sets
router.get('/sets/', checkUserLoggedIn, async (req, res) => {
	try{
		const user_id = req.session.passport.user;
		const tutor_user = await User.findById(user_id);
		const sets = tutor_user.tutorDeets.sets.map(set => ({title: set.title,
			date: set.date,
			id: set._id
		})).reverse();
		res.json({sets: sets});
	} catch(err) {
		res.send(err);
	}
});
// Get set
router.get('/set/:set_id', async (req, res) => {
	try{
		const user_id = req.session.passport.user;
		const tutor_user = await User.findById(user_id);
		const set = tutor_user.tutorDeets.sets.find(x => x._id == req.params.set_id);
		const temp_questions = set.questions.map(question => ({
			body: question.body,
			id: question._id,
			answers: question.answers,
			mcq: question.mcq
		}));
		
		let embiggened_students = []

		let student_users = await User.find({'_id': { $in: set.students.map(student_id => mongoose.Types.ObjectId(student_id))}})
		student_users = student_users.filter(student_user => student_user.student);
		embiggened_students = student_users.map(student_user => {
			let student_set = student_user.studentDeets.sets.find(set => set.setId.toString() === req.params.set_id.toString());
			return({
				id: student_user._id,
				displayName: student_user.displayName,
				username: student_user.username,
				profileIcon: student_user.profileIcon,
				numAnswered: student_set.questions.filter(question => question.responses.length).length,
				numCorrect: student_set.questions.filter(question => question.responses.length === 1).length,
				completeDate: student_set.completeDate,
			})
		})
		res.json({
			id: set._id,
			title: set.title,
			date: set.date,
			questions: temp_questions,
			students: embiggened_students
		});
	}catch(err){
		console.log(err)
		res.send(err)
	}
})
// Get student's answers
router.get('/set_answers/:set_id/:student_username', async (req, res) => {
	try{
		const user_id = req.session.passport.user;
		const set_id = req.params.set_id;
		const student_username = req.params.student_username;
		const student_user = await User.findOne({username: student_username});
		const tutor_user = await User.findById(user_id);
		let embiggened_questions = [];
		student_user.studentDeets.sets.find(set => set.setId.toString() === set_id).questions.forEach((question, index) => {
			embiggened_questions.push({
				responses: question.responses,
				question: tutor_user.tutorDeets.sets.find(set => set._id.toString() === set_id.toString()).questions[index]
			});
		});
		if(tutor_user.tutorDeets.students.includes(student_user._id)){
			res.json({embiggened_questions});
		}
	}catch(err){
		console.log(err)
		res.status(400).send(err);
	}
});
router.get('/get-student-performance/sets/:student_username', async (req, res) => {
	try{
		const user_id = req.session.passport.user;
		const student_username = req.params.student_username;
		const student_user = await User.findOne({username: student_username});
		const tutor_user = await User.findById(user_id);
		if(tutor_user.tutorDeets.students.includes(student_user._id) && student_user.student){
			res.json({
    			displayName: student_user.displayName,
    			profileIcon: student_user.profileIcon,
    			sets: student_user.studentDeets.sets.filter(set => tutor_user.tutorDeets.sets.map(tset => tset._id.toString()).includes(set.setId.toString())).map(set => ({
    				id: set.setId,
    				setLength: set.setLength,
    				numCorrect: set.questions.filter(question => question.responses.length).length,
    				completeDate: set.completeDate,
    				title: tutor_user.tutorDeets.sets.find(tset => tset._id.toString() === set.setId.toString())?.title
    			})),
    			noAuth: false
			})
		}else{
			res.json({noAuth: true});
		}
	}catch(err){
		res.status(400).send(err)
	}
});

// ---------------------- Post ---------------------------
// Post Set
router.post('/sets/', (req, res) => {
	try{
		const user_id = req.session.passport.user;
		const body = req.body;
		const set = {
			title: body.title,
			description: body.description
		}
		if(!set.title){
			res.status(400).send({err: 'You must name your set'})
		}else{
			User.findById(user_id, (err, tutor_user) => { //Finds Tutor from id and passes it into tutor var
				if(tutor_user.tutorDeets.sets.map(qset => qset.title).includes(set.title)){
					res.status(400).send({err: `You already have a set named "${set.title}"`})
				}else{
					tutor_user.tutorDeets.sets.push(set);
					tutor_user.save() //Saves the set to the database
					.then(data => {
						res.sendStatus(201);
					})
					.catch(err => {
						res.send({err: err.toString()});
					});
				}
			});
		}
	}catch(err){
		res.status(400).send(err)
	}
});

// Post Question
router.post('/questions/:set_id', (req, res) => {
	try{
		const user_id = req.session.passport.user;
		const body = req.body;
		const question = {
			body: body.body,
			mcq: body.mcq,
			answers: body.answers
		}

		if(!question.answers.length){
			res.status(400).json({err: 'Questions must have answers'});
		}else if(!question.body) {
			res.status(400).json({err: 'Questions must have bodies'});
		}else if(question.answers.includes('')){
			res.status(400).json({err: 'Answers cannot be empty'})
		}else if(question.body.length > 1024){
			res.status(400).json({err: 'Questions must be no more than 1024 characters'})
		}else if(question.answers.filter(answer => answer.length > 128).length){
			res.status(400).json({err: 'Answers must be no more than 128 characters'})
		}else{
			User.findById(user_id, (err, tutor_user) => { //Finds Tutor from id and passes it into tutor var
				// const set = tutor.sets.id(req.params.set_id);
				if(!tutor_user.tutorDeets.sets.find(set => set._id == req.params.set_id).students.length){
					tutor_user.tutorDeets.sets.find(set => set._id == req.params.set_id).questions.push(question);

					tutor_user.save() //Saves the set to the database
					.then(data => {
						res.sendStatus(201);
					})
					.catch(err => {
						res.send(err);
					});
				}else{
					res.status(400).json({err: 'You mustn\'t edit an assigned set'})
				}
			});
		}
	}catch(err){
		res.status(400).send(err)
	}
});

// DELETE
// Delete Set
router.delete('/sets/:set_id', async (req, res) => {
	try{
		const user_id = req.session.passport.user;
		const set_id = req.params.set_id;

		const tutor_user = await User.findById(user_id);
		const duplicate_sets = tutor_user.tutorDeets.sets; //I have absolutely no clue why, but .find() is causing ID's to change.
		for (const student_id of duplicate_sets.find(qset => qset._id == set_id).students){
			try{
				const student_user = await User.findById(student_id);
				student_user.studentDeets.sets.find(qset => qset.setId == set_id).deleted = true;
				await student_user.save();
			}catch(err){
				console.log(err);
			}
		}
		const filtered = tutor_user.tutorDeets.sets.filter(set => set._id.toString() != set_id.toString());
		tutor_user.tutorDeets.sets = filtered;
		await tutor_user.save();
		res.sendStatus(200);
	}catch(err){
		console.log('delete tutor/sets/:set_id - error', err)
		res.status(400).send(err);
	}
});
// Delete Question
router.delete('/set/:set_id/:question_id', (req, res) => {
	try{
		const tutor_id = req.session.passport.user;
		const set_id = req.params.set_id;
		const question_id = req.params.question_id;

		User.findById(tutor_id, (err, tutor_user) => {
			const set = tutor_user.tutorDeets.sets.find(set => set._id == req.params.set_id);
			tutor_user.tutorDeets.sets.find(set => set._id == req.params.set_id).questions.splice(indexOfProperty(set.questions, '_id', question_id), 1);
			tutor_user.save() //Saves the set to the database
			.then(data => {
				res.sendStatus(200);
			})
			.catch(err => {
				res.send(err);
			});
		});
	}catch(err){
		res.status(400).send(err);
	}
});

function indexOfProperty(arr, propName, val){
	for(let i = 0; i < arr.length; i++){
		if(arr[i][propName] === val){
			return(i);
		}
	}
	return(false);
}

module.exports = router;