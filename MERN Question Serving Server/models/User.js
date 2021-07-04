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
	},
	students: [
		{type: mongoose.Schema.Types.ObjectId}
	]
});

const TutorSchema = new mongoose.Schema({
	sets: [SetSchema],
	students: [{
		type: mongoose.Schema.Types.ObjectId
	}],
	studentRequests: [{
		type: mongoose.Schema.Types.ObjectId
	}]
});

const StudentSchema = new mongoose.Schema({
	tutors: [{
		type: mongoose.Schema.Types.ObjectId
	}],
	tutorRequests: [{
		type: mongoose.Schema.Types.ObjectId
	}],
	blockedTutors: [{
		type: mongoose.Schema.Types.ObjectId
	}],
	sets: [
		{
			tutorId: mongoose.Schema.Types.ObjectId,
			setId: mongoose.Schema.Types.ObjectId,
			setLength: Number,
			numCorrect: Number,
			deleted: Boolean,
			questions: [
				{
					responses: [String]
				}
			],
			completeDate: Date
    	}
	]
});

const UserSchema = mongoose.Schema({
	displayName: {
		type: String,
		required: true
	},
	username: {
		type: String
	},
	bio: {
		type:String
	},
	googleId: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	profileIcon: {
		type: String
	},
	description: String,
	tutor: {
		type: Boolean
	},
	student: {
		type: Boolean
	},
	studentDeets: StudentSchema,
	tutorDeets: TutorSchema,
	startDate: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', UserSchema);