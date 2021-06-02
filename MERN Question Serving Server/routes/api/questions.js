const express = require('express');
const Question = require('../../models/Question')

const router = express.router();

// Get
// Returns all questions
router.get('/', (req, res) => {
	Question.find()
		.then(question => res.json(questions))
		.catch(err => res.status(err.statusCode).json({error: "Sorry, something went wrong on our end"}))
});

// Returns an individual question based on question ID
router.get('/:id', (req, res) => {
	Question.findById(req.params.id)
		.then(question => res.json(question))
		.catch(err => res.status(404).json({error: "Question not found"}))
});
// Returns a set of questions based on author ID
router.get('/:author_id', (req, res) => {
	Question.find({author: req.params.author_id})
		.then(question => res.json(questions))
		.catch(err => res.status(404).json({error: "No questions found"}))
});
// Returns a set of questions based on set ID
router.get('/:set_id', (req, res) => {
	Question.find({author: req.params.set_id})
		.then(question => res.json(questions))
		.catch(err => res.status(404).json({error: "No questions found"}))
});

//Post
//Adds a question
router.post('/', (req, res) => {
	Question.create(req.body)
		.then(question => res.json({msg: "Question added!"}))
		.catch(err => res.status(err.statusCode).json({error: "Sorry, something went wrong on our end"}))
});

//Updates a question
router.post('/:id', (req, res) => {
	Question.findByIdAndUpdate(req.params.id, req.body)
		.then(question => res.json({msg: "Question updated!"}))
		.catch(err => res.status(err.statusCode).json({error: "Sorry, something went wrong on our end"}))
});

// Deletes a question
router.delete('/:id', (req, res) => {
	Question.findByIdAndRemove(req.params.id, req.body)
		.then(question => res.json({msg: "Question deleted!"}))
		.catch(err => res.status(err.statusCode).json({error: "Sorry, something went wrong on our end"}))
});


module.exports = router