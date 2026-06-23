const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
    try {
        const { industry, goal, budget, email } = req.body;

        if (!industry || !goal || !budget || !email) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
        You are a top-tier Digital Marketing Strategist. Create a 3-Month Marketing Roadmap for a client.
        Client Details:
        - Industry: ${industry}
        - Primary Goal: ${goal}
        - Monthly Budget: ${budget}

        Provide the response in the following strictly valid JSON format (no markdown):
        {
            "month1": {
                "focus": "string",
                "actionItems": ["string", "string"]
            },
            "month2": {
                "focus": "string",
                "actionItems": ["string", "string"]
            },
            "month3": {
                "focus": "string",
                "actionItems": ["string", "string"]
            },
            "estimatedResults": "string"
        }
        `;

        const result = await model.generateContent(prompt);
        let rawText = result.response.text();
        
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const strategy = JSON.parse(rawText);

        res.json({ success: true, strategy });
    } catch (error) {
        console.error('Strategy Generator Error:', error);
        res.status(500).json({ error: 'Failed to generate strategy. Please try again.' });
    }
});

module.exports = router;
