const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

// GET /api/clients - Get all clients (Admin view)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT id, username, name, email, project_status, created_at FROM clients ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('Fetch all clients error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST /api/clients - Create a new client (Admin action)
router.post('/', async (req, res) => {
    try {
        const { username, password, name, email, project_status, project_details } = req.body;
        
        if (!username || !password || !name || !email) {
            return res.status(400).json({ error: 'Username, password, name, and email are required.' });
        }

        // Check if username already exists
        const [existing] = await pool.promise().query('SELECT id FROM clients WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists.' });
        }

        const details = project_details || JSON.stringify({ seoScore: 0, trafficGrowth: '0%', recentMilestone: 'Onboarding', nextSteps: 'Initial Audit' });

        const [result] = await pool.promise().query(
            'INSERT INTO clients (username, password, name, email, project_status, project_details) VALUES (?, ?, ?, ?, ?, ?)',
            [username, password, name, email, project_status || 'Onboarding', details]
        );

        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        console.error('Create client error:', err);
        res.status(500).json({ error: 'Failed to create client' });
    }
});

// POST /api/clients/login - Client authentication
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.promise().query('SELECT id, username, name, email FROM clients WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            const user = rows[0];
            const token = jwt.sign(
                { id: user.id, role: 'client', username: user.username },
                process.env.JWT_SECRET || 'supersecrettechdigikey123',
                { expiresIn: '7d' }
            );
            res.json({ success: true, token, user });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET /api/clients/:username - Get client dashboard data
router.get('/:username', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT name, email, project_status, project_details, created_at FROM clients WHERE username = ?', [req.params.username]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Client not found' });
        }
    } catch (err) {
        console.error('Fetch client error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
