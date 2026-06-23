const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        
        // Return mock data if API key is missing or is the placeholder
        if (!apiKey || apiKey === 'your_news_api_key') {
            return res.json([
                {
                    title: "The Future of AI in Digital Marketing",
                    description: "How artificial intelligence is reshaping how brands interact with consumers.",
                    url: "#",
                    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
                    source: { name: "Tech Trends" },
                    publishedAt: new Date().toISOString()
                },
                {
                    title: "SEO Strategies for 2026",
                    description: "Top strategies to dominate search engine rankings in the coming year.",
                    url: "#",
                    urlToImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop",
                    source: { name: "Marketing Weekly" },
                    publishedAt: new Date().toISOString()
                },
                {
                    title: "Maximizing ROI with Paid Ads",
                    description: "Learn how to optimize your PPC campaigns for maximum return on investment.",
                    url: "#",
                    urlToImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
                    source: { name: "AdWeek" },
                    publishedAt: new Date().toISOString()
                }
            ]);
        }

        const response = await axios.get(`https://newsapi.org/v2/everything?q="digital marketing"&sortBy=publishedAt&language=en&pageSize=6&apiKey=${apiKey}`);
        res.json(response.data.articles);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

module.exports = router;
