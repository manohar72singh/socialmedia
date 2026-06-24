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

        const generateWithRetry = async (modelName, contents, config, retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    return await ai.models.generateContent({
                        model: modelName,
                        contents: contents,
                        config: config
                    });
                } catch (error) {
                    const is503 = error.status === 503 || (error.message && error.message.includes('503'));
                    if (is503 && i < retries - 1) {
                        const delay = 1000 * Math.pow(2, i);
                        console.warn(`[Retry] Model ${modelName} is busy (503). Retrying in ${delay}ms... (Attempt ${i + 1}/${retries - 1})`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    } else {
                        throw error;
                    }
                }
            }
        };

        let reply;
        try {
            reply = await generateWithRetry('gemini-2.5-flash', contents, {
                systemInstruction: SYSTEM_PROMPT
            });
        } catch (genError) {
            console.warn('gemini-2.5-flash failed with error, falling back to gemini-2.0-flash...');
            try {
                reply = await generateWithRetry('gemini-2.0-flash', contents, {
                    systemInstruction: SYSTEM_PROMPT
                });
            } catch (fallbackError2) {
                console.warn('gemini-2.0-flash failed, falling back to gemini-1.5-flash...');
                reply = await generateWithRetry('gemini-1.5-flash', contents, {
                    systemInstruction: SYSTEM_PROMPT
                });
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
