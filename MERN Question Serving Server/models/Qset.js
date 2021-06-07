const mongoose = require('mongoose');
const Tutor = require('./Tutor');

const QsetSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: String,
	author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tutor',
        required: true
	},
	// questions: [{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: Question
	// }],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Qset', QsetSchema);