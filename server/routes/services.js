const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET all services
router.get('/', (req, res) => {
    pool.query('SELECT * FROM services ORDER BY created_at ASC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// POST new service
router.post('/', (req, res) => {
    const { title, description, icon, color } = req.body;
    if (!title || !description || !icon || !color) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const query = 'INSERT INTO services (title, description, icon, color) VALUES (?, ?, ?, ?)';
    pool.query(query, [title, description, icon, color], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: results.insertId, title, description, icon, color });
    });
});

// PUT update service
router.put('/:id', (req, res) => {
    const { title, description, icon, color } = req.body;
    const { id } = req.params;
    const query = 'UPDATE services SET title=?, description=?, icon=?, color=? WHERE id=?';
    pool.query(query, [title, description, icon, color, id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ id, title, description, icon, color });
    });
});

// DELETE service
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM services WHERE id=?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Service deleted successfully' });
    });
});

module.exports = router;
