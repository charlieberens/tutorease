const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
	author_id: {
		type: Number,
		required: true
	},
	set_id: {
		type: Number,
		required: true
	},
	mcq: { //False represents a free-input question
		type: Boolean,
		required: true
	},
	answers: { //Array with correct answers. If free-input, array should only contain the correct value
		type: [{value: String, correct: Boolean}], 
		required: true
	},
	body: { //String will be later formatted into HTYL
		type: String,
		required: true
	}
});

module.exports = Question = mongoose.model('question', QuestionSchema)