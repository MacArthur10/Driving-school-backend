const mongoose = require('mongoose');
const { Schema } = mongoose;

const userAnswerSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sujetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sujet', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionAwnser', required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.models.UserAnswer || mongoose.model('UserAnswer', userAnswerSchema);