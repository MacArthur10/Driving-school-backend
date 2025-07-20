const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionAnwserSchema = new Schema({
  question: { type: String, required: true },
  fichier: { type: String },
  anwser: { type: String, required: true },
  falseAnwser1: { type: String, required: true },
  falseAnwser2: { type: String, required: true },
  falseAnwser3: { type: String, required: true },
  sujet: { type: mongoose.Schema.Types.ObjectId, ref: 'Sujet', required: true },
  subscription: { type: String, required: true },
  type: { type: String, required: true },
  centre: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true }
});

module.exports = mongoose.models.QuestionAwnser || mongoose.model('QuestionAwnser', questionAnwserSchema);
