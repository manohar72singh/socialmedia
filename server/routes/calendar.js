const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/calendar/generate
router.post('/generate', async (req, res) => {
    const { topic } = req.body;
    
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const prompt = `
            You are an expert Social Media Manager for a digital marketing agency.
            Generate a 30-day social media content calendar for the topic: "${topic}".
            Return the output as a valid JSON array of exactly 30 objects.
            Do NOT wrap the output in markdown code blocks like \`\`\`json. Return strictly the raw JSON array.
            Each object should have the following keys:
            - "day": integer (1 to 30)
            - "title": string (A short punchy post title)
            - "platform": string (e.g., LinkedIn, Instagram, Twitter)
            - "type": string (e.g., Image, Carousel, Video, Poll)
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        // Try to parse the JSON output
        let jsonStr = response.text;
        // Strip markdown if AI stubbornly included it
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        const calendarData = JSON.parse(jsonStr);

        res.json(calendarData);
    } catch (error) {
        console.error('Calendar generation error:', error);
        res.status(500).json({ error: 'Failed to generate content calendar' });
    }
});

// GET /api/calendar/client/:id - Fetch posts for a client
router.get('/client/:id', async (req, res) => {
    try {
        const pool = require('../db/connection').promise();
        const [rows] = await pool.query('SELECT * FROM content_calendar WHERE client_id = ? ORDER BY post_date ASC, post_time ASC', [req.params.id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/calendar/admin - Fetch all posts
router.get('/admin', async (req, res) => {
    try {
        const pool = require('../db/connection').promise();
        const [rows] = await pool.query('SELECT c.*, cl.name as client_name, cl.email as client_email FROM content_calendar c JOIN clients cl ON c.client_id = cl.id ORDER BY c.post_date ASC, c.post_time ASC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/calendar - Schedule a new post
router.post('/', async (req, res) => {
    try {
        const pool = require('../db/connection').promise();
        const { client_id, platform, post_date, post_time, caption, image_url } = req.body;
        const [result] = await pool.query(
            'INSERT INTO content_calendar (client_id, platform, post_date, post_time, caption, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [client_id, platform, post_date, post_time, caption, image_url || null]
        );
        res.json({ id: result.insertId, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to schedule post' });
    }
});

// PUT /api/calendar/:id/status - Approve or reject
router.put('/:id/status', async (req, res) => {
    try {
        const pool = require('../db/connection').promise();
        const { status } = req.body;
        await pool.query('UPDATE content_calendar SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// DELETE /api/calendar/:id
router.delete('/:id', async (req, res) => {
    try {
        const pool = require('../db/connection').promise();
        await pool.query('DELETE FROM content_calendar WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete' });
    }
});

module.exports = router;
