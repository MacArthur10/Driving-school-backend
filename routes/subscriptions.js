// In /routes/subscriptions.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const SubscriptionService = require('../services/subscriptionService');

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
    const { plan, userId } = req.body;

    const prices = {
        basic: { amount: 150, duration: 30 },
        standard: { amount: 200, duration: 45 },
        premium: { amount: 295, duration: 60 },
        silver: { amount: 350, duration: 75 },
        gold: { amount: 450, duration: 90 },
        diamond: { amount: 550, duration: 120 },
        elite: { amount: 650, duration: 150 },
        platinum: { amount: 750, duration: 180 },
        ultimate: { amount: 850, duration: 210 },
    };

    if (!prices[plan]) {
        return res.status(400).send({ error: 'Invalid plan selected.' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: plan.charAt(0).toUpperCase() + plan.slice(1),
                        },
                        unit_amount: prices[plan].amount * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        // Save subscription details in the database
        await SubscriptionService.createSubscription(userId, plan, prices[plan].amount, prices[plan].duration);

        res.status(200).send({ id: session.id });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;