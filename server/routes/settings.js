const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Initialize settings table if it doesn't exist
const initSettingsTable = async () => {
    try {
        await pool.promise().query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(50) UNIQUE NOT NULL,
                setting_value TEXT
            )
        `);
        
        // Insert default values if table is empty
        const [rows] = await pool.promise().query('SELECT COUNT(*) as count FROM settings');
        if (rows[0].count === 0) {
            const defaults = [
                ['brand_name', 'Tech Digi'],
                ['brand_email', 'contact@techdigi.com'],
                ['brand_phone', '+91 9876543210'],
                ['brand_color', 'indigo']
            ];
            await pool.promise().query('INSERT INTO settings (setting_key, setting_value) VALUES ?', [defaults]);
        }
    } catch (err) {
        console.error('Settings init error:', err);
    }
};

initSettingsTable();

// GET /api/settings - Get all settings
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT setting_key, setting_value FROM settings');
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT /api/settings - Update settings
router.put('/', async (req, res) => {
    try {
        const settings = req.body; // e.g. { brand_name: 'Tech Digi', brand_color: 'blue' }
        
        for (const [key, value] of Object.entries(settings)) {
            await pool.promise().query(
                'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                [key, value, value]
            );
        }
        res.json({ success: true });
    } catch (err) {
        console.error('Update settings error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
