const Subscription = require('../data/Subscription');
const User = require('../data/users');

async function createSubscription(userId, plan, subjects) {
    const subscription = new Subscription({ userId, plan, subjects });
    await subscription.save();
    await User.findByIdAndUpdate(userId, { $push: { subscriptions: subscription._id } });
    return subscription;
}

async function cancelSubscription(userId) {
    const subscription = await Subscription.findOneAndUpdate(
        { userId, status: 'active' },
        { status: 'cancelled', endDate: Date.now() },
        { new: true }
    );
    return subscription;
}

module.exports = {
    createSubscription,
    cancelSubscription
};
