const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const apicache = require('apicache');
let cache = apicache.middleware;

// GET /api/blogs
router.get('/', cache('5 minutes'), (req, res) => {
    pool.query("SELECT * FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// GET /api/blogs/all (Admin)
router.get('/all', (req, res) => {
    pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// GET /api/blogs/:id
router.get('/:id', (req, res) => {
    pool.query('SELECT * FROM blog_posts WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ error: 'Blog not found' });
        res.json(results[0]);
    });
});

// POST /api/blogs
router.post('/', (req, res) => {
    const { title, category, excerpt, content, image, author, status, scheduled_at } = req.body;
    const query = 'INSERT INTO blog_posts (title, category, excerpt, content, image, author, status, scheduled_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    pool.query(query, [title, category, excerpt, content, image, author || 'Admin', status || 'published', scheduled_at || null], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: results.insertId, message: 'Blog post added' });
    });
});

// PUT /api/blogs/:id
router.put('/:id', (req, res) => {
    const { title, category, excerpt, content, image, author, status, scheduled_at } = req.body;
    const query = 'UPDATE blog_posts SET title=?, category=?, excerpt=?, content=?, image=?, author=?, status=?, scheduled_at=? WHERE id=?';
    pool.query(query, [title, category, excerpt, content, image, author, status || 'published', scheduled_at || null, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Blog post updated' });
    });
});

// DELETE /api/blogs/:id
router.delete('/:id', (req, res) => {
    pool.query('DELETE FROM blog_posts WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Blog post deleted' });
    });
});

const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/blogs/generate
router.post('/generate', async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) return res.status(400).json({ error: 'Topic is required' });

        const prompt = `You are an expert SEO content writer for a digital marketing agency. 
Write a comprehensive, engaging, and SEO-optimized blog post about: "${topic}".
Provide the output in strict JSON format with exactly these four keys:
- "title": A catchy, SEO-friendly title (string).
- "excerpt": A concise 2-sentence summary for search engines (string). Make sure this key is exactly "excerpt".
- "content": The full article content formatted in HTML (using <h2>, <h3>, <p>, <ul>, <li>, <strong>, etc.). Write at least 4 paragraphs.
- "image": An image URL representing the topic. Use this exact format replacing {keywords} with 2-3 URL-encoded keywords (e.g., seo%20marketing): "https://image.pollinations.ai/prompt/{keywords}?width=1200&height=600&nologo=true".

Do not wrap the JSON in markdown code blocks. Just return the raw JSON object.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }

        const data = JSON.parse(jsonText);
        //console.log("GENERATED AI DATA:", JSON.stringify(data, null, 2));
        res.json(data);
    } catch (error) {
        console.error('AI Generation error:', error);
        res.status(500).json({ error: 'Failed to generate blog post' });
    }
});

// POST /api/blogs/bulk-generate
router.post('/bulk-generate', async (req, res) => {
    try {
        const { topics } = req.body;
        if (!topics || !Array.isArray(topics) || topics.length === 0) {
            return res.status(400).json({ error: 'Array of topics is required' });
        }

        res.json({ message: 'Bulk generation started. Blogs will appear in drafts shortly.' });

        // Process asynchronously
        for (const topic of topics) {
            if (!topic.trim()) continue;
            try {
                const prompt = `You are an expert SEO content writer for a digital marketing agency. 
Write a comprehensive, engaging, and SEO-optimized blog post about: "${topic}".
Provide the output in strict JSON format with exactly these four keys:
- "title": A catchy, SEO-friendly title (string).
- "excerpt": A concise 2-sentence summary for search engines (string).
- "content": The full article content formatted in HTML (using <h2>, <h3>, <p>, <ul>, <li>, <strong>, etc.). Write at least 4 paragraphs.
- "image": An image URL representing the topic. Format: "https://image.pollinations.ai/prompt/{url_encoded_keywords}?width=1200&height=600&nologo=true".

Do not wrap the JSON in markdown code blocks. Just return the raw JSON object.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

                let jsonText = response.text.trim();
                if (jsonText.startsWith('```json')) jsonText = jsonText.substring(7, jsonText.length - 3).trim();
                else if (jsonText.startsWith('```')) jsonText = jsonText.substring(3, jsonText.length - 3).trim();

                const data = JSON.parse(jsonText);

                const query = 'INSERT INTO blog_posts (title, category, excerpt, content, image, author, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
                pool.query(query, [data.title, 'SEO', data.excerpt, data.content, data.image, 'AI Generator', 'draft']);

                // Add a small delay to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (err) {
                console.error(`Failed to generate bulk blog for topic: ${topic}`, err);
            }
        }
    } catch (error) {
        console.error('AI Bulk Generation error:', error);
    }
});

// POST /api/blogs/repurpose
router.post('/repurpose', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

        const prompt = `As an expert social media manager, repurpose the following blog post into 3 social media posts.
Blog Title: "${title}"
Blog Content Snippet: "${content.substring(0, 1000)}..."

Provide the output in strict JSON format with exactly these three keys:
- "linkedin": A professional, engaging LinkedIn post with line breaks and 3-4 hashtags.
- "twitter": A punchy Twitter thread (use 🧵) or a single engaging tweet under 280 characters with hashtags.
- "instagram": A visually descriptive, engaging Instagram caption with emojis and 10-15 relevant hashtags.

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
    } catch (error) {
        console.error('AI Repurpose error:', error);
        res.status(500).json({ error: 'Failed to generate social media posts' });
    }
});

module.exports = router;
