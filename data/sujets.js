const mongoose = require('mongoose');
const { Schema } = mongoose;

const sujetSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  subscription: { type: String, required: true },
  type: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionAwnser' }],
  centre: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true }
});

module.exports = mongoose.models.Sujet || mongoose.model('Sujet', sujetSchema);