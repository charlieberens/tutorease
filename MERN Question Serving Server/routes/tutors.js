const express = require('express');
const router = express.Router();
const Tutor = require('../models/Tutor');

const mongoose = require('mongoose');
const bodyParser = require('body-parser')

// ---------------------- Get ----------------------------
// Get tutor
router.get('/', (req, res) => {
	res.send('You are on tutor')
});

// Get sets
router.get('/sets/:tutor_id', async (req, res) => {
	try{
		const tutor = await Tutor.findById(req.params.tutor_id);
		const sets = tutor.sets.map(set => ({title: set.title, date: set.date, id: set._id})).reverse();
		res.json({sets: sets});
	} catch(err) {
		res.send(err);
	}
});
// Get set
router.get('/set/:tutor_id/:set_id', async(req, res) => {
	try{
		const tutor = await Tutor.findById(req.params.tutor_id);
		const set = tutor.sets.find(x => x._id == req.params.set_id);
		res.json({set: set});
	}catch(err){
		res.send(err)
	}
})

// ---------------------- Post ---------------------------
// Post tutor
router.post('/', (req, res) => {
	const body = req.body;
	const tutor = new Tutor({
		name: body.name,
		email: body.email,
		username: body.username
	});

	tutor.save() //Saves the user to the database
	.then(data => {
		res.sendStatus(201);
	})
	.catch(err => {
		res.send(err);
	});
});

// Post Set
router.post('/sets/', (req, res) => {
	const body = req.body;
	const qset = {
		title: body.title,
		description: body.description
	}
	Tutor.findById(body.author_id, (err, tutor) => { //Finds Tutor from id and passes it into tutor var
		tutor.sets.push(qset);
		tutor.save() //Saves the set to the database
		.then(data => {
			res.sendStatus(201);
		})
		.catch(err => {
			res.send(err);
		});
	});
});

// Post Question
router.post('/questions/:tutor_id/:set_id', (req, res) => {
	const body = req.body;
	const question = {
		body: body.body,
		mcq: body.mcq,
		answers: body.answers
	}

	Tutor.findById(req.params.tutor_id, (err, tutor) => { //Finds Tutor from id and passes it into tutor var
		// const set = tutor.sets.id(req.params.set_id);
		tutor.sets.find(x => x._id == req.params.set_id).questions.push(question);

		//Garbage code that pushes question
		tutor.save() //Saves the set to the database
		.then(data => {
			res.sendStatus(201);
		})
		.catch(err => {
			res.send(err);
		});
	});
});

// Delete Set
router.delete('/sets/:tutor_id/:set_id', (req, res) => {
	const set_id = req.params.set_id;
	const tutor_id = req.params.tutor_id;

	Tutor.findById(tutor_id, (err, tutor) => { //Finds Tutor from id and passes it into tutor var
		const filtered = tutor.sets.filter((x) => {
			return x._id != set_id;
		});
		tutor.sets = filtered;
		tutor.save() //Saves the set to the database
		.then(data => {
			res.sendStatus(200);
		})
		.catch(err => {
			res.send(err);
		});
	});
});

module.exports = router;