const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const pool = require('../db/connection');

router.post('/generate', async (req, res) => {
    try {
        const { prompt, type, clientId, tier } = req.body;
        
        if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
        
        // Rate limiting or access control based on tier
        if (tier === 'free') {
            return res.status(403).json({ error: 'Premium feature. Please upgrade your plan to use the AI Content Generator.' });
        }

        const systemInstructions = {
            'ad_copy': 'You are an expert copywriter. Write highly converting Facebook/Google ad copy based on the user prompt. Keep it punchy and include emojis.',
            'blog_outline': 'You are an SEO expert. Write a comprehensive blog post outline with H1, H2, and H3 tags based on the topic.',
            'social_caption': 'You are a social media manager. Write an engaging Instagram/LinkedIn caption with relevant hashtags.'
        };

        const instruction = systemInstructions[type] || 'You are a helpful AI assistant for digital marketing.';

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: instruction
            }
        });

        // Log usage (simplified)
        if (clientId) {
            pool.query(
                `INSERT INTO ai_usage (client_id, words_generated, requests_made) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE words_generated = words_generated + ?, requests_made = requests_made + 1`,
                [clientId, response.text.split(' ').length, response.text.split(' ').length]
            );
        }

        res.json({ content: response.text });
    } catch (error) {
        console.error('AI Generator error:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

module.exports = router;
