const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Admin Login
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded for demo. In production, check against DB.
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign(
            { id: 1, role: 'admin', username: 'admin' }, 
            process.env.JWT_SECRET || 'supersecrettechdigikey123', 
            { expiresIn: '24h' }
        );
        res.json({ success: true, token, user: { role: 'admin', username: 'admin' } });
    } else {
        res.status(401).json({ error: 'Invalid admin credentials' });
    }
});

// Verify Token Endpoint
router.get('/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ valid: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecrettechdigikey123');
        res.json({ valid: true, user: decoded });
    } catch (err) {
        res.json({ valid: false });
    }
});

module.exports = router;
