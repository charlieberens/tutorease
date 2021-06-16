const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
	body: {
		type: String,
		required: true
	},
	mcq: {
		type: Boolean,
		required: true
	},
	answers: [
		{type: String, required: true}
	]//,
	//index: {
	//	type: Number,
	//	required: true
	//}
});

const SetSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: String,
	questions: [QuestionSchema],
	date: {
		type: Date,
		default: Date.now
	}
});

const TutorSchema = mongoose.Schema({
	userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
	},
	sets: [SetSchema],
	students: [{
		type: mongoose.Schema.Types.ObjectId
	}],
	studentRequests: [{
		type: mongoose.Schema.Types.ObjectId
	}]
});

module.exports = mongoose.model('Tutor', TutorSchema);