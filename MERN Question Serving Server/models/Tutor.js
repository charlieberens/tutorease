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
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	username: {
		type:String,
		required: true
	},
	sets: [SetSchema],
	start_date: {
		type: Date,
		default: Date.now
	}//,
	// students: [{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: Student
	// }],
});

module.exports = mongoose.model('Tutor', TutorSchema);