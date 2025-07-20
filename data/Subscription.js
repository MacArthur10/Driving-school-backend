const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, required: true, enum: ['basic', 'premium','silver','gold','diamond','elite'] },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'active' },
    subjects: { type: mongoose.Schema.Types.ObjectId, ref: 'Sujet' }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
