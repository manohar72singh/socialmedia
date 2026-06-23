const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/competitor/analyze
router.post('/analyze', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        // Step 1: Scrape the website
        // Add http:// if missing to avoid axios errors
        let targetUrl = url.startsWith('http') ? url : `https://${url}`;
        
        let html = '';
        try {
            const response = await axios.get(targetUrl, { 
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 8000
            });
            html = response.data;
        } catch (scrapeErr) {
            console.error('Scraping error:', scrapeErr.message);
            return res.status(400).json({ error: 'Could not access the website. It might be blocking scrapers or invalid.' });
        }

        const $ = cheerio.load(html);
        
        // Extract SEO elements
        const title = $('title').text().trim();
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        const h1 = $('h1').first().text().trim();
        
        // Extract text content from body, limited to first 3000 chars to save tokens
        let textContent = $('body').text().replace(/\s+/g, ' ').trim();
        if (textContent.length > 3000) textContent = textContent.substring(0, 3000);

        // Step 2: Analyze with Gemini
        const prompt = `
            You are a master SEO Consultant. Analyze the following competitor website data and give actionable advice.
            URL: ${targetUrl}
            Title: ${title}
            Meta Description: ${metaDescription}
            H1: ${h1}
            Sample Body Text: ${textContent}

            Return your analysis as a strictly valid JSON object (no markdown formatting like \`\`\`json) with the following structure:
            {
              "strengths": ["string", "string"],
              "weaknesses": ["string", "string"],
              "keyword_opportunities": ["string", "string", "string"],
              "action_plan": "string (a paragraph describing what our agency should do to outrank them)"
            }
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const aiResponse = await model.generateContent(prompt);

        let jsonStr = aiResponse.response.text();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        
        const analysis = JSON.parse(jsonStr);
        
        res.json({
            url: targetUrl,
            scrapedData: { title, h1, metaDescription },
            analysis
        });

    } catch (err) {
        console.error('Competitor Analysis Error:', err);
        res.status(500).json({ error: 'Failed to analyze competitor website' });
    }
});

module.exports = router;
