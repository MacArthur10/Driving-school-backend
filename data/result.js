const mongoose = require('mongoose');
const { Schema } = mongoose;

const resultSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sujetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sujet', required: true },
  sujetName: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  status: { type: String, enum: ['Réussi', 'Échoué'], required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, required: true }
});

module.exports = mongoose.models.Result || mongoose.model('Result', resultSchema);