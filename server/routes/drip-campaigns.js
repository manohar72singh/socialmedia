const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../db/connection');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/drip-campaigns/generate
router.post('/generate', async (req, res) => {
    try {
        const { name, targetAudience, goal } = req.body;

        if (!name || !targetAudience || !goal) {
            return res.status(400).json({ error: 'Name, Audience, and Goal are required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `
        You are an expert Email Marketing Copywriter. Create a highly converting 4-part email drip campaign.
        
        Campaign Name: ${name}
        Target Audience: ${targetAudience}
        Campaign Goal: ${goal}
        
        The 4 emails should be:
        1. Welcome/Introduction
        2. Value Add / Educational
        3. Case Study / Social Proof
        4. The Pitch / Call to Action

        Provide the response as a JSON array of objects, where each object represents an email and has the following keys:
        - subject: The email subject line
        - delay: String indicating when to send (e.g. "Day 1", "Day 3")
        - body: The email body in plain text format (you can use basic greeting placeholders like [First Name])

        Return ONLY the raw JSON array.
        `;

        const result = await model.generateContent(prompt);
        let rawText = result.response.text();
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const sequenceData = JSON.parse(rawText);

        // Save to DB
        const [insertResult] = await pool.promise().query(
            'INSERT INTO email_campaigns (name, target_audience, goal, sequence_data, status) VALUES (?, ?, ?, ?, ?)',
            [name, targetAudience, goal, JSON.stringify(sequenceData), 'draft']
        );

        res.json({ success: true, id: insertResult.insertId, sequence: sequenceData });

    } catch (error) {
        console.error('Drip Campaign Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate campaign' });
    }
});

// GET /api/drip-campaigns
router.get('/', async (req, res) => {
    try {
        const [campaigns] = await pool.promise().query('SELECT * FROM email_campaigns ORDER BY created_at DESC');
        res.json(campaigns);
    } catch (error) {
        console.error('Fetch Campaigns Error:', error);
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

module.exports = router;
