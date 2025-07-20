const mongoose = require('mongoose');
const { Schema } = mongoose;

const userProgressSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sujetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sujet', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionAwnser', required: true },
  attempted: { type: Boolean, default: false },
  correct: { type: Boolean, default: false },
  dateAttempted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProgress', userProgressSchema);