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
	const user_id = req.session.passport.user;
	const user = await User.findById(user_id);
	if(!user.tutor){
		res.sendStatus(400)
	}else{
		res.json(user.tutorDeets)
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

		await User.find({'_id': { $in: set.students.map(student_id => mongoose.Types.ObjectId(student_id))}}, (err, student_users) => {
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
		});
	}catch(err){
		console.log(err)
		res.send(err)
	}
})
// Get student's answers
router.get('/set_answers/:set_id/:student_id', async (req, res) => {
	try{
		const user_id = req.session.passport.user;
		const set_id = req.params.set_id;
		const student_id = req.params.student_id;
		const tutor_user = await User.findById(user_id);
		if(tutor_user.tutorDeets.students.includes(student_id)){
			const student_user = await User.findById(student_id);
			res.json({questions: student_user.studentDeets.sets.find(set => set.setId.toString() === set_id).questions});
		}
	}catch(err){
		console.log(err)
		res.statusCode(400).send(err);
	}
});

// ---------------------- Post ---------------------------
// Post Set
router.post('/sets/', (req, res) => {
	const user_id = req.session.passport.user;
	const body = req.body;
	const set = {
		title: body.title,
		description: body.description
	}
	User.findById(user_id, (err, tutor_user) => { //Finds Tutor from id and passes it into tutor var
		tutor_user.tutorDeets.sets.push(set);
		tutor_user.save() //Saves the set to the database
		.then(data => {
			res.sendStatus(201);
		})
		.catch(err => {
			res.send(err);
		});
	});
});

// Post Question
router.post('/questions/:set_id', (req, res) => {
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
	}else{
		User.findById(user_id, (err, tutor_user) => { //Finds Tutor from id and passes it into tutor var
			// const set = tutor.sets.id(req.params.set_id);
			tutor_user.tutorDeets.sets.find(set => set._id == req.params.set_id).questions.push(question);
			console.log('pay attention', tutor_user)

			tutor_user.save() //Saves the set to the database
			.then(data => {
				res.sendStatus(201);
			})
			.catch(err => {
				res.send(err);
			});
		});
	}
});

// DELETE
// Delete Set
router.delete('/sets/:set_id', (req, res) => {
	const user_id = req.session.passport.user;
	const set_id = req.params.set_id;

	User.findById(user_id, (err, tutor_user) => { //Finds Tutor from id and passes it into tutor var
		tutor_user.tutorDeets.sets.find(set => set._id = set_id).students.forEach(student_id => {
			User.findById(student_id, (err, student_user) => {
				student_user.studentDeets.sets.find(set => set.setId == set_id).deleted = true;
				student_user.save();
			});
		});		
		const filtered = tutor_user.tutorDeets.sets.filter(set => set._id != set_id);
		tutor_user.tutorDeets.sets = filtered;
		tutor_user.save() //Saves the set to the database
		.then(data => {
			res.sendStatus(200);
		})
		.catch(err => {
			res.send(err);
		});
	});
});
// Delete Question
router.delete('/set/:set_id/:question_id', (req, res) => {
	const tutor_id = req.session.passport.user;
	const set_id = req.params.set_id;
	const question_id = req.params.question_id;

	User.findById(tutor_id, (err, tutor_user) => { //Finds Tutor from id and passes it into tutor var
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