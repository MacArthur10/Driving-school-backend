const subscriptionService = require('../services/subscriptionService');

async function createSubscription(req, res) {
    try {
        const subscription = await subscriptionService.createSubscription(req.params.userId, req.body.plan, req.body.subjects);
        res.status(201).json(subscription);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function cancelSubscription(req, res) {
    try {
        const subscription = await subscriptionService.cancelSubscription(req.params.userId);
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createSubscription,
    cancelSubscription
};
