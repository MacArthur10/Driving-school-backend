const mongoose = require('mongoose');
const { Schema } = mongoose;

const loginHistorySchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loginDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoginHistory', loginHistorySchema);