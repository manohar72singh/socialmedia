const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are TechBot, a professional AI assistant for Tech Digi - a premium digital marketing agency.

Your role:
- Answer questions about Tech Digi's services: SEO, Social Media Marketing, Web Design, PPC Advertising, Content Marketing, and Analytics.
- Be friendly, concise, and highly professional. 
- Use emojis sparingly to feel approachable.
- Keep each response to 2-3 sentences maximum.
- If someone asks something outside digital marketing, politely redirect them to our services.
- Always end with a subtle CTA to contact us or book a consultation.
- LEAD GENERATION RULE: After answering their initial question, always ask for their email address so our experts can send them a custom strategy. E.g., "What's your email so I can have an expert follow up with a detailed plan?"
- If you detect the user's name or email in their message, acknowledge it personally.

Pricing (for reference only, guide them to contact for exact quotes):
- SEO packages start from $500/month
- Social Media from $300/month
- Web Design from $1,500 (one-time)
- PPC Management from $400/month + ad spend

Remember: You represent a PREMIUM agency. Sound confident, knowledgeable, and results-driven.`;

router.post('/', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Build raw conversation history
        const rawContents = [
            ...history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            {
                role: 'user',
                parts: [{ text: message }]
            }
        ];

        // Gemini requires alternating roles starting with 'user'.
        // Let's collapse consecutive messages of the same role to prevent errors.
        const contents = [];
        for (const item of rawContents) {
            if (contents.length > 0 && contents[contents.length - 1].role === item.role) {
                contents[contents.length - 1].parts[0].text += '\n\n' + item.parts[0].text;
            } else {
                contents.push(item);
            }
        }

        let reply;
        try {
            reply = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: {
                    systemInstruction: SYSTEM_PROMPT
                }
            });
        } catch (genError) {
            if (genError.status === 503 || (genError.message && genError.message.includes('503'))) {
                console.warn('gemini-2.5-flash is busy, falling back to gemini-1.5-flash...');
                reply = await ai.models.generateContent({
                    model: 'gemini-1.5-flash',
                    contents: contents,
                    config: {
                        systemInstruction: SYSTEM_PROMPT
                    }
                });
            } else {
                throw genError;
            }
        }
        
        if (req.io) {
            req.io.emit('new_chat', { message: message.substring(0, 50) + '...' });
        }

        res.json({ reply: reply.text });
    } catch (error) {
        console.error('Error from Gemini API:', error);
        
        // Return a friendly fallback message instead of a raw API error
        const friendlyMessage = "I'm currently assisting a lot of clients and experiencing high traffic. Please try again in a few moments or contact our support!";
        res.json({ reply: friendlyMessage });
    }
});

module.exports = router;
