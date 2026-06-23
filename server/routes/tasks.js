const express = require('express');
const router = express.Router();
const db = require('../db/connection').promise();

// Get tasks for a client (or all if admin)
router.get('/', async (req, res) => {
    try {
        const { client_id } = req.query;
        let query = 'SELECT * FROM tasks ORDER BY created_at DESC';
        let params = [];

        if (client_id) {
            query = 'SELECT * FROM tasks WHERE client_id = ? ORDER BY created_at DESC';
            params = [client_id];
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching tasks' });
    }
});

// Create a task
router.post('/', async (req, res) => {
    try {
        const { client_id, title, description, status } = req.body;
        if (!client_id || !title) return res.status(400).json({ error: 'Client ID and title required' });

        const [result] = await db.query(
            'INSERT INTO tasks (client_id, title, description, status) VALUES (?, ?, ?, ?)',
            [client_id, title, description || '', status || 'todo']
        );
        res.json({ id: result.insertId, client_id, title, description, status: status || 'todo' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update a task status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
