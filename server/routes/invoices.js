const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET /api/invoices
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM invoices ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET /api/invoices/client/:email
router.get('/client/:email', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM invoices WHERE client_email = ? ORDER BY created_at DESC', [req.params.email]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST /api/invoices
router.post('/', async (req, res) => {
    const { client_name, client_email, service_details, amount, due_date } = req.body;
    try {
        const [result] = await pool.promise().query(
            'INSERT INTO invoices (client_name, client_email, service_details, amount, due_date) VALUES (?, ?, ?, ?, ?)',
            [client_name, client_email, service_details, amount, due_date]
        );
        res.status(201).json({ id: result.insertId, message: 'Invoice created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});

// PUT /api/invoices/:id/status
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await pool.promise().query('UPDATE invoices SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// PUT /api/invoices/:id/pay - Mark an invoice as paid (Simulated Payment)
router.put('/:id/pay', async (req, res) => {
    try {
        await pool.promise().query(
            'UPDATE invoices SET status = ? WHERE id = ?',
            ['Paid', req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Pay invoice error:', err);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

module.exports = router;
