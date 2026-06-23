const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const apicache = require('apicache');
let cache = apicache.middleware;

// GET /api/faqs
router.get('/', cache('5 minutes'), (req, res) => {
    pool.query('SELECT * FROM faqs ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// POST /api/faqs
router.post('/', (req, res) => {
    const { question, answer, category } = req.body;
    const query = 'INSERT INTO faqs (question, answer, category) VALUES (?, ?, ?)';
    pool.query(query, [question, answer, category || 'general'], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: results.insertId, message: 'FAQ added' });
    });
});

// PUT /api/faqs/:id
router.put('/:id', (req, res) => {
    const { question, answer, category } = req.body;
    const query = 'UPDATE faqs SET question=?, answer=?, category=? WHERE id=?';
    pool.query(query, [question, answer, category, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'FAQ updated' });
    });
});

// DELETE /api/faqs/:id
router.delete('/:id', (req, res) => {
    pool.query('DELETE FROM faqs WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'FAQ deleted' });
    });
});

module.exports = router;
