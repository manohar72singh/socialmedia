const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config({ path: '../.env' });
const leadsRouter = require('./routes/leads');
const chatRouter = require('./routes/chat');
const newsRouter = require('./routes/news');
const servicesRouter = require('./routes/services');
const testimonialsRouter = require('./routes/testimonials');
const newsletterRouter = require('./routes/newsletter');
const portfolioRouter = require('./routes/portfolio');
const teamRouter = require('./routes/team');
const faqsRouter = require('./routes/faqs');
const pricingRouter = require('./routes/pricing');
const blogsRouter = require('./routes/blogs');
const analyticsRouter = require('./routes/analytics');
const bookingsRouter = require('./routes/bookings');
const pool = require('./db/connection');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Pass io to req so routes can use it
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Check DB connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL Database.');
        connection.release();
    }
});

// Start Cron Job for Auto-Publishing Scheduled Blogs
setInterval(() => {
    const query = `
        UPDATE blog_posts 
        SET status = 'published' 
        WHERE status = 'scheduled' AND scheduled_at <= NOW()
    `;
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Error auto-publishing scheduled blogs:', err.message);
        } else if (results.affectedRows > 0) {
            console.log(`Auto-published ${results.affectedRows} scheduled blog(s).`);
        }
    });
}, 60 * 1000); // Check every minute

const whatsappRouter = require('./routes/whatsapp');
const clientsRouter = require('./routes/clients');
const calendarRouter = require('./routes/calendar');
const invoicesRouter = require('./routes/invoices');
const competitorRouter = require('./routes/competitor');
const seoAuditRouter = require('./routes/seo-audit');
const dripCampaignsRouter = require('./routes/drip-campaigns');
const approvalsRouter = require('./routes/approvals');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const settingsRouter = require('./routes/settings');
const strategyRouter = require('./routes/strategy');
const tasksRouter = require('./routes/tasks');
const proposalsRouter = require('./routes/proposals');
const vaultRouter = require('./routes/vault');

app.use('/api/leads', leadsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/news', newsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/team', teamRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/pricing', pricingRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/whatsapp', whatsappRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/competitor', competitorRouter);
app.use('/api/seo-audit', seoAuditRouter);
app.use('/api/strategy', strategyRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/proposals', proposalsRouter);
app.use('/api/vault', vaultRouter);
app.use('/api/drip-campaigns', dripCampaignsRouter);
app.use('/api/approvals', approvalsRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/settings', settingsRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
