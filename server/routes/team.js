const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const apicache = require('apicache');
let cache = apicache.middleware;

// GET /api/team
router.get('/', cache('5 minutes'), (req, res) => {
    pool.query('SELECT * FROM team ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        results = results.map(r => ({
            ...r,
            specialties: typeof r.specialties === 'string' ? JSON.parse(r.specialties) : r.specialties,
            stats: typeof r.stats === 'string' ? JSON.parse(r.stats) : r.stats
        }));
        res.json(results);
    });
});

// POST /api/team
router.post('/', (req, res) => {
    const { name, role, emoji, bio, specialties, gradient, bgColor, linkedin, stats } = req.body;
    const query = 'INSERT INTO team (name, role, emoji, bio, specialties, gradient, bgColor, linkedin, stats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    pool.query(query, [name, role, emoji, bio, JSON.stringify(specialties || []), gradient, bgColor, linkedin, JSON.stringify(stats || {})], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: results.insertId, message: 'Team member added' });
    });
});

// PUT /api/team/:id
router.put('/:id', (req, res) => {
    const { name, role, emoji, bio, specialties, gradient, bgColor, linkedin, stats } = req.body;
    const query = 'UPDATE team SET name=?, role=?, emoji=?, bio=?, specialties=?, gradient=?, bgColor=?, linkedin=?, stats=? WHERE id=?';
    pool.query(query, [name, role, emoji, bio, JSON.stringify(specialties || []), gradient, bgColor, linkedin, JSON.stringify(stats || {}), req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Team member updated' });
    });
});

// DELETE /api/team/:id
router.delete('/:id', (req, res) => {
    pool.query('DELETE FROM team WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Team member deleted' });
    });
});

module.exports = router;
