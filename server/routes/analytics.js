const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Helper to wrap queries in promises and handle missing tables
const queryAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) {
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    resolve([{ count: 0 }]); // Return 0 count if table doesn't exist
                } else {
                    reject(err);
                }
            } else {
                resolve(results);
            }
        });
    });
};

// POST /api/analytics/track
router.post('/track', async (req, res) => {
    try {
        const { path, userAgent } = req.body;
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        
        await pool.promise().query(
            'INSERT INTO page_views (path, user_agent, ip_address) VALUES (?, ?, ?)',
            [path, userAgent, ip]
        );
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error tracking page view:', err);
        res.status(500).json({ error: 'Failed to track' });
    }
});

// GET /api/analytics
router.get('/', async (req, res) => {
    try {
        // 1. Get total counts
        const [leadsCount] = await queryAsync('SELECT COUNT(*) as count FROM leads');
        const [subscribersCount] = await queryAsync('SELECT COUNT(*) as count FROM newsletter_subscribers');
        const [projectsCount] = await queryAsync('SELECT COUNT(*) as count FROM portfolio');
        const [blogsCount] = await queryAsync('SELECT COUNT(*) as count FROM blog_posts');

        // 2. Get Real-time Page Views for the last 7 days
        const [pageViewsData] = await pool.promise().query(`
            SELECT 
                DATE_FORMAT(created_at, '%b %d') as date,
                COUNT(*) as views
            FROM page_views
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%b %d')
            ORDER BY DATE(created_at) ASC
        `);

        // Get total page views
        const [totalViewsResult] = await pool.promise().query('SELECT COUNT(*) as count FROM page_views');
        const totalViews = totalViewsResult[0].count || 0;

        // 3. Get top paths
        const [topPages] = await pool.promise().query(`
            SELECT path, COUNT(*) as views 
            FROM page_views 
            GROUP BY path 
            ORDER BY views DESC 
            LIMIT 5
        `);

        res.json({
            totals: {
                leads: leadsCount.count || 0,
                subscribers: subscribersCount.count || 0,
                projects: projectsCount.count || 0,
                views: totalViews
            },
            chartData: pageViewsData.length > 0 ? pageViewsData : [{ date: 'Today', views: 0 }],
            topPages: topPages
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

module.exports = router;
