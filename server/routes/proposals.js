const express = require('express');
const router = express.Router();
const db = require('../db/connection').promise();

// Get all proposals (for admin)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT p.*, c.name as client_name, c.email as client_email FROM proposals p JOIN clients c ON p.client_id = c.id ORDER BY p.created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching proposals' });
    }
});

// Get proposals for a specific client
router.get('/client/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM proposals WHERE client_id = ? ORDER BY created_at DESC', [req.params.id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single proposal by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT p.*, c.name as client_name, c.email as client_email FROM proposals p JOIN clients c ON p.client_id = c.id WHERE p.id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Proposal not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create proposal
router.post('/', async (req, res) => {
    try {
        const { client_id, title, content, price } = req.body;
        const [result] = await db.query(
            'INSERT INTO proposals (client_id, title, content, price) VALUES (?, ?, ?, ?)',
            [client_id, title, content, price]
        );
        res.json({ id: result.insertId, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create proposal' });
    }
});

// Sign proposal
router.post('/:id/sign', async (req, res) => {
    try {
        const { signature_data } = req.body;
        await db.query('UPDATE proposals SET status = ?, signature_data = ? WHERE id = ?', ['signed', signature_data, req.params.id]);
        
        // Optionally create an invoice automatically upon signing
        const [propRows] = await db.query('SELECT * FROM proposals WHERE id = ?', [req.params.id]);
        if (propRows.length > 0) {
            const prop = propRows[0];
            await db.query(
                'INSERT INTO invoices (client_id, amount, status, description) VALUES (?, ?, ?, ?)',
                [prop.client_id, prop.price, 'pending', `Invoice for Proposal: ${prop.title}`]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to sign proposal' });
    }
});

// Delete proposal
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM proposals WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete proposal' });
    }
});

module.exports = router;
