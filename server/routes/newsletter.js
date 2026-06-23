const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { sendEmail } = require('../utils/emailService');

// POST /api/newsletter - Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Valid email is required' });
    }

    try {
        // Check if already subscribed
        const checkQuery = 'SELECT id FROM newsletter_subscribers WHERE email = ?';
        pool.query(checkQuery, [email], async (err, results) => {
            if (err) {
                console.error('Error checking subscriber:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Email is already subscribed' });
            }

            // Insert new subscriber
            const insertQuery = 'INSERT INTO newsletter_subscribers (email) VALUES (?)';
            pool.query(insertQuery, [email], async (insertErr) => {
                if (insertErr) {
                    // Create table if it doesn't exist, then insert
                    if (insertErr.code === 'ER_NO_SUCH_TABLE') {
                        const createTableQuery = `
                            CREATE TABLE newsletter_subscribers (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                email VARCHAR(255) NOT NULL UNIQUE,
                                subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                status ENUM('active', 'unsubscribed') DEFAULT 'active'
                            )
                        `;
                        pool.query(createTableQuery, (createErr) => {
                            if (createErr) return res.status(500).json({ error: 'Failed to create table' });
                            
                            // Retry insert
                            pool.query(insertQuery, [email], (retryErr) => {
                                if (retryErr) return res.status(500).json({ error: 'Failed to save subscription' });
                                sendWelcomeEmail(email, res);
                            });
                        });
                        return;
                    }
                    return res.status(500).json({ error: 'Database error' });
                }
                sendWelcomeEmail(email, res);
            });
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

async function sendWelcomeEmail(email, res) {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; background: #0F172A; color: white;">
            <h2 style="color: #818CF8;">You're in! Welcome to the club.</h2>
            <p style="color: #cbd5e1;">Thank you for subscribing to the Tech Digi newsletter.</p>
            <p style="color: #cbd5e1;">Every week, we'll send you actionable growth hacks, SEO updates, and exclusive resources to help you scale your business.</p>
            <br/>
            <p style="color: #94a3b8; font-size: 12px;">If you wish to unsubscribe, you can reply to this email.</p>
        </div>
    `;
    
    await sendEmail(email, "Welcome to Tech Digi Newsletter! 🚀", html);
    
    return res.status(201).json({ 
        message: 'Successfully subscribed'
    });
}

// POST /api/newsletter/send - Send campaign to all subscribers (Admin only)
router.post('/send', async (req, res) => {
    const { subject, content, recipients } = req.body;
    
    if (!subject || !content || !recipients || !Array.isArray(recipients)) {
        return res.status(400).json({ error: 'Subject, content, and recipients array are required' });
    }

    try {
        // Send email to all recipients (in a real app, use BCC or send individually)
        // Here we just send to the first one and BCC the rest for simplicity
        if (recipients.length > 0) {
            // For testing/mock purposes, we will just call sendEmail
            // We could loop, but for safety in mock let's just log it or pass multiple
            await sendEmail(recipients.join(','), subject, content);
        }
        res.status(200).json({ message: 'Campaign sent successfully' });
    } catch (e) {
        console.error('Error sending campaign:', e);
        res.status(500).json({ error: 'Failed to send campaign' });
    }
});

// GET /api/newsletter/subscribers - Alias for AdminNewsletter
router.get('/subscribers', (req, res) => {
    const query = 'SELECT email, subscribed_at as created_at FROM newsletter_subscribers ORDER BY subscribed_at DESC';
    pool.query(query, (err, results) => {
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') return res.json([]);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// GET /api/newsletter - Get all subscribers
router.get('/', (req, res) => {
    const query = 'SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC';
    pool.query(query, (err, results) => {
        if (err) {
            // If table doesn't exist yet, just return empty array
            if (err.code === 'ER_NO_SUCH_TABLE') return res.json([]);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/newsletter/auto-campaign
router.post('/auto-campaign', async (req, res) => {
    try {
        // Fetch 3 most recent published blogs
        pool.query("SELECT title, excerpt FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC LIMIT 3", async (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (results.length === 0) return res.status(400).json({ error: 'Not enough blogs to generate a newsletter' });

            const blogsText = results.map((b, i) => `Blog ${i+1} Title: ${b.title}\nBlog ${i+1} Excerpt: ${b.excerpt}`).join('\n\n');

            const prompt = `You are an expert email marketer. I have just published these new blog posts:
${blogsText}

Write an engaging email newsletter to send to my subscribers.
Return the output in strict JSON format with exactly these two keys:
- "subject": A catchy, high-converting email subject line.
- "content": The full email body formatted in beautiful, responsive HTML. Use a modern dark theme style (e.g., #0F172A background, #818CF8 accents) and include the blog titles and excerpts.

Do not wrap the JSON in markdown code blocks. Just return the raw JSON object.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            let jsonText = response.text.trim();
            if (jsonText.startsWith('```json')) jsonText = jsonText.substring(7, jsonText.length - 3).trim();
            else if (jsonText.startsWith('```')) jsonText = jsonText.substring(3, jsonText.length - 3).trim();

            const data = JSON.parse(jsonText);
            res.json(data);
        });
    } catch (error) {
        console.error('AI Newsletter error:', error);
        res.status(500).json({ error: 'Failed to generate newsletter campaign' });
    }
});

module.exports = router;
