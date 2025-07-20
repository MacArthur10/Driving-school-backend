const User = require('../data/users');

async function getSujetsBySubscription(req, res) {
    try {
        const user = await User.findById(req.params.userId).populate({
            path: 'subscriptions',
            populate: {
                path: 'subjects',
                model: 'Sujet'
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const sujets = user.subscriptions.flatMap(subscription => subscription.subjects);
        res.status(200).json(sujets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getSujetsBySubscription
};
