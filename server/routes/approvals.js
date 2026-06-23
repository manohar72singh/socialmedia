const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Get all approvals (Admin view)
router.get('/', async (req, res) => {
    try {
        const [approvals] = await pool.promise().query(`
            SELECT a.*, c.company_name, c.email 
            FROM content_approvals a
            JOIN clients c ON a.client_id = c.id
            ORDER BY a.created_at DESC
        `);
        res.json(approvals);
    } catch (error) {
        console.error('Error fetching approvals:', error);
        res.status(500).json({ error: 'Failed to fetch approvals' });
    }
});

// Get approvals for a specific client (Client view)
router.get('/client/:clientId', async (req, res) => {
    try {
        const [approvals] = await pool.promise().query(
            'SELECT * FROM content_approvals WHERE client_id = ? ORDER BY created_at DESC',
            [req.params.clientId]
        );
        res.json(approvals);
    } catch (error) {
        console.error('Error fetching client approvals:', error);
        res.status(500).json({ error: 'Failed to fetch approvals' });
    }
});

// Create new approval request (Admin -> Client)
router.post('/', async (req, res) => {
    try {
        const { client_id, content_type, title, content_details } = req.body;
        
        if (!client_id || !content_type || !title || !content_details) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const [result] = await pool.promise().query(
            'INSERT INTO content_approvals (client_id, content_type, title, content_details, status) VALUES (?, ?, ?, ?, ?)',
            [client_id, content_type, title, JSON.stringify(content_details), 'pending']
        );
        
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error creating approval:', error);
        res.status(500).json({ error: 'Failed to create approval request' });
    }
});

// Update approval status (Client -> Admin)
router.put('/:id', async (req, res) => {
    try {
        const { status, feedback } = req.body;
        
        if (!['pending', 'approved', 'rejected', 'changes_requested'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        await pool.promise().query(
            'UPDATE content_approvals SET status = ?, feedback = ? WHERE id = ?',
            [status, feedback || null, req.params.id]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating approval:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

module.exports = router;
