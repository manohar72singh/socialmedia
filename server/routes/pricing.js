const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const apicache = require('apicache');
let cache = apicache.middleware;

// GET /api/pricing
router.get('/', cache('5 minutes'), (req, res) => {
    pool.query('SELECT * FROM pricing_plans ORDER BY monthlyPrice ASC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        results = results.map(r => ({
            ...r,
            popular: Boolean(r.popular),
            features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features
        }));
        res.json(results);
    });
});

// POST /api/pricing
router.post('/', (req, res) => {
    const { name, icon, tagline, monthlyPrice, yearlyPrice, currency, color, glow, borderColor, popular, features, cta } = req.body;
    const query = 'INSERT INTO pricing_plans (name, icon, tagline, monthlyPrice, yearlyPrice, currency, color, glow, borderColor, popular, features, cta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    pool.query(query, [name, icon, tagline, monthlyPrice, yearlyPrice, currency, color, glow, borderColor, popular ? 1 : 0, JSON.stringify(features || []), cta], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: results.insertId, message: 'Pricing plan added' });
    });
});

// PUT /api/pricing/:id
router.put('/:id', (req, res) => {
    const { name, icon, tagline, monthlyPrice, yearlyPrice, currency, color, glow, borderColor, popular, features, cta } = req.body;
    const query = 'UPDATE pricing_plans SET name=?, icon=?, tagline=?, monthlyPrice=?, yearlyPrice=?, currency=?, color=?, glow=?, borderColor=?, popular=?, features=?, cta=? WHERE id=?';
    pool.query(query, [name, icon, tagline, monthlyPrice, yearlyPrice, currency, color, glow, borderColor, popular ? 1 : 0, JSON.stringify(features || []), cta, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Pricing plan updated' });
    });
});

// DELETE /api/pricing/:id
router.delete('/:id', (req, res) => {
    pool.query('DELETE FROM pricing_plans WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Pricing plan deleted' });
    });
});

module.exports = router;
