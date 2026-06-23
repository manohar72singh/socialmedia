const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET /api/whatsapp/campaigns - Get template
router.get('/template', (req, res) => {
    // We can store templates in DB, but for simulation we just return a default
    res.json({ template: "Hi {{name}}! Welcome to Tech Digi. We've received your request for {{service}}. Our expert will reach out to you shortly." });
});

// POST /api/whatsapp/send - Simulate sending message to a lead
router.post('/send', async (req, res) => {
    const { leadId, phone, message } = req.body;
    if (!leadId || !phone) return res.status(400).json({ error: 'Lead ID and Phone required' });

    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update lead to mark whatsapp_sent = true
        await pool.promise().query('UPDATE leads SET whatsapp_sent = true WHERE id = ?', [leadId]);

        res.json({ success: true, message: 'WhatsApp message simulated as sent' });
    } catch (err) {
        console.error('WhatsApp Error:', err);
        res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
});

// POST /api/whatsapp/send-all - Simulate bulk send to all un-sent leads
router.post('/send-all', async (req, res) => {
    const { template } = req.body;
    try {
        const [leads] = await pool.promise().query('SELECT * FROM leads WHERE whatsapp_sent = false OR whatsapp_sent IS NULL');
        
        if (leads.length === 0) {
            return res.status(400).json({ message: 'No pending leads to send messages to.' });
        }

        // Update all in one go for simulation
        const ids = leads.map(l => l.id);
        const placeholders = ids.map(() => '?').join(',');
        await pool.promise().query(`UPDATE leads SET whatsapp_sent = true WHERE id IN (${placeholders})`, ids);

        res.json({ success: true, count: leads.length, message: `Successfully sent to ${leads.length} leads` });
    } catch (err) {
        console.error('Bulk WhatsApp Error:', err);
        res.status(500).json({ error: 'Failed to send bulk messages' });
    }
});

module.exports = router;
