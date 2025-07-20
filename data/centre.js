const mongoose = require('mongoose');
const CentreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: String
});
module.exports = mongoose.model('Centre', CentreSchema); 