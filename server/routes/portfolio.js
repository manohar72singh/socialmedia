const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const apicache = require('apicache');
let cache = apicache.middleware;

// GET /api/portfolio
router.get('/', cache('5 minutes'), (req, res) => {
    pool.query('SELECT * FROM portfolio ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        // parse JSON fields
        results = results.map(r => ({ ...r, metrics: typeof r.metrics === 'string' ? JSON.parse(r.metrics) : r.metrics }));
        res.json(results);
    });
});

// POST /api/portfolio
router.post('/', (req, res) => {
    const { category, title, industry, tag, description, image, metrics, gradient, accentColor, duration } = req.body;
    const query = 'INSERT INTO portfolio (category, title, industry, tag, description, image, metrics, gradient, accentColor, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    pool.query(query, [category, title, industry, tag, description, image, JSON.stringify(metrics || []), gradient, accentColor, duration], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: results.insertId, message: 'Portfolio item added' });
    });
});

// PUT /api/portfolio/:id
router.put('/:id', (req, res) => {
    const { category, title, industry, tag, description, image, metrics, gradient, accentColor, duration } = req.body;
    const query = 'UPDATE portfolio SET category=?, title=?, industry=?, tag=?, description=?, image=?, metrics=?, gradient=?, accentColor=?, duration=? WHERE id=?';
    pool.query(query, [category, title, industry, tag, description, image, JSON.stringify(metrics || []), gradient, accentColor, duration, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Portfolio item updated' });
    });
});

// DELETE /api/portfolio/:id
router.delete('/:id', (req, res) => {
    pool.query('DELETE FROM portfolio WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Portfolio item deleted' });
    });
});

module.exports = router;
