const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../db/connection');

// Example packages
const PLANS = {
    pro: process.env.STRIPE_PRO_PRICE_ID,
    enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID
};

// Create a checkout session
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { plan, clientId, email } = req.body;
        const priceId = PLANS[plan];
        
        if (!priceId) {
            return res.status(400).json({ error: 'Invalid plan selected' });
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer_email: email,
            client_reference_id: String(clientId),
            success_url: `${process.env.VITE_API_URL || 'http://localhost:5173'}/client?session_id={CHECKOUT_SESSION_ID}&status=success`,
            cancel_url: `${process.env.VITE_API_URL || 'http://localhost:5173'}/client?status=cancelled`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Stripe Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const clientId = session.client_reference_id;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        // Upgrade user tier in DB
        const tier = session.amount_total > 50000 ? 'enterprise' : 'pro'; // basic logic for demo
        pool.query(
            `UPDATE clients SET tier = ?, stripe_customer_id = ?, subscription_status = 'active' WHERE id = ?`,
            [tier, customerId, clientId],
            (err) => {
                if (err) console.error('DB Update Error:', err);
                else console.log(`Upgraded client ${clientId} to ${tier}`);
            }
        );
        
        // Also insert into subscriptions
        pool.query(
            `INSERT INTO subscriptions (client_id, stripe_subscription_id, status) VALUES (?, ?, 'active')`,
            [clientId, subscriptionId]
        );
    }

    res.json({ received: true });
});

module.exports = router;
