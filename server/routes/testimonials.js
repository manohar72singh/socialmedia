const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET all testimonials
router.get('/', (req, res) => {
    pool.query('SELECT * FROM testimonials ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// POST new testimonial
router.post('/', (req, res) => {
    const { name, role, content, image } = req.body;
    if (!name || !role || !content || !image) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const query = 'INSERT INTO testimonials (name, role, content, image) VALUES (?, ?, ?, ?)';
    pool.query(query, [name, role, content, image], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: results.insertId, name, role, content, image });
    });
});

// PUT update testimonial
router.put('/:id', (req, res) => {
    const { name, role, content, image } = req.body;
    const { id } = req.params;
    const query = 'UPDATE testimonials SET name=?, role=?, content=?, image=? WHERE id=?';
    pool.query(query, [name, role, content, image, id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ id, name, role, content, image });
    });
});

// DELETE testimonial
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM testimonials WHERE id=?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Testimonial deleted successfully' });
    });
});

module.exports = router;
