require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function seedDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'techdigi'
        });

        console.log('Connected to MySQL. Seeding data...');

        // 1. Portfolio
        const portfolioData = [
            ['SEO', 'EcomStore India', 'E-Commerce', '🏆 Top Result', 'Complete SEO overhaul that transformed a struggling online store into a top-3 ranking powerhouse in 90 days.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80', '[{"label":"Organic Traffic","value":"+1300%","color":"#10b981"},{"label":"Keywords Ranked","value":"890+","color":"#6366f1"},{"label":"Revenue","value":"+340%","color":"#f59e0b"}]', 'from-blue-600/30 to-indigo-600/20', '#6366f1', '90 Days'],
            ['PPC Ads', 'HealthFirst Clinic', 'Healthcare', '🔥 Record ROI', 'Rebuilt entire ad strategy for a healthcare brand — slashed cost-per-lead by 79% while 7x-ing monthly appointments.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80', '[{"label":"Monthly Leads","value":"40→280","color":"#a855f7"},{"label":"Cost Per Lead","value":"₹850→₹180","color":"#10b981"},{"label":"ROAS","value":"6.8x","color":"#f59e0b"}]', 'from-purple-600/30 to-pink-600/20', '#a855f7', '60 Days'],
            ['Web Design', 'LuxeRealty Homes', 'Real Estate', '⚡ Speed Record', 'Redesigned a slow, outdated website into a blazing-fast lead machine. Load time dropped from 6.2s to 0.9s.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80', '[{"label":"Load Speed","value":"6.2s→0.9s","color":"#10b981"},{"label":"Monthly Leads","value":"5→120+","color":"#6366f1"},{"label":"Conversion Rate","value":"+1075%","color":"#f59e0b"}]', 'from-orange-600/30 to-red-600/20', '#f97316', '45 Days']
        ];
        
        await connection.query('DELETE FROM portfolio');
        for (const p of portfolioData) {
            await connection.query('INSERT INTO portfolio (category, title, industry, tag, description, image, metrics, gradient, accentColor, duration) VALUES (?,?,?,?,?,?,?,?,?,?)', p);
        }

        // 2. Team
        const teamData = [
            ['Arjun Sharma', 'Founder & CEO', '👨‍💼', '10+ years in digital marketing. Built campaigns for 200+ brands across India. Believer in data-driven growth.', '["Strategy", "Business Dev", "AI Tools"]', 'from-indigo-500 to-purple-600', 'rgba(99, 102, 241, 0.15)', 'https://linkedin.com', '{"clients":"200+","exp":"10 yrs","projects":"500+"}'],
            ['Priya Mehta', 'Head of SEO', '👩‍💻', 'SEO geek with a passion for ranking everything. Has taken 50+ websites to Page 1 of Google.', '["Technical SEO", "Link Building", "Analytics"]', 'from-pink-500 to-rose-600', 'rgba(236, 72, 153, 0.15)', 'https://linkedin.com', '{"clients":"50+","exp":"7 yrs","projects":"200+"}'],
            ['Rahul Verma', 'Creative Director', '🎨', 'Where art meets conversion. Designs that look stunning AND drive real business results.', '["UI/UX Design", "Branding", "Motion Design"]', 'from-orange-500 to-amber-600', 'rgba(249, 115, 22, 0.15)', 'https://linkedin.com', '{"clients":"80+","exp":"6 yrs","projects":"300+"}']
        ];
        
        await connection.query('DELETE FROM team');
        for (const t of teamData) {
            await connection.query('INSERT INTO team (name, role, emoji, bio, specialties, gradient, bgColor, linkedin, stats) VALUES (?,?,?,?,?,?,?,?,?)', t);
        }

        // 3. FAQs
        const faqsData = [
            ['How soon will I see results from digital marketing?', 'It depends on the service. Paid Ads take 7-14 days. SEO takes 60-90 days for significant results.', 'general'],
            ['What makes Tech Digi different?', 'We combine AI-powered tools with human expertise. Real-time dashboards, weekly updates, and transparency.', 'general'],
            ['Can I upgrade my plan later?', 'Absolutely! You can upgrade your plan at any time. The new plan will be activated from the next billing cycle.', 'pricing'],
            ['How long is the contract?', 'We work on a month-to-month basis — no long-term lock-ins. You can cancel at any time.', 'pricing']
        ];
        
        await connection.query('DELETE FROM faqs');
        for (const f of faqsData) {
            await connection.query('INSERT INTO faqs (question, answer, category) VALUES (?,?,?)', f);
        }

        // 4. Pricing Plans
        const plansData = [
            ['Starter', 'Zap', 'Perfect for new businesses', 15000, 12000, '₹', 'from-blue-500 to-indigo-600', 'rgba(99, 102, 241, 0.3)', 'rgba(99,102,241,0.25)', 0, '[{"text":"SEO Audit","included":true},{"text":"8 Posts/Month","included":true},{"text":"WhatsApp Marketing","included":false}]', 'Start Growing'],
            ['Growth', 'Star', 'Best for scaling businesses', 35000, 29000, '₹', 'from-indigo-500 via-purple-500 to-pink-500', 'rgba(139, 92, 246, 0.4)', 'rgba(139,92,246,0.5)', 1, '[{"text":"Advanced SEO","included":true},{"text":"20 Posts/Month","included":true},{"text":"Google + Meta Ads","included":true}]', 'Get Started Now'],
            ['Enterprise', 'Building2', 'For established brands', 75000, 62000, '₹', 'from-amber-500 to-orange-500', 'rgba(245, 158, 11, 0.3)', 'rgba(245,158,11,0.3)', 0, '[{"text":"Full SEO Domination","included":true},{"text":"Unlimited Content","included":true},{"text":"Full Custom Website","included":true}]', 'Let\'s Talk']
        ];

        await connection.query('DELETE FROM pricing_plans');
        for (const p of plansData) {
            await connection.query('INSERT INTO pricing_plans (name, icon, tagline, monthlyPrice, yearlyPrice, currency, color, glow, borderColor, popular, features, cta) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', p);
        }

        // 5. Blog Posts
        const blogsData = [
            ['10 SEO Tricks That Tripled Traffic', 'SEO', 'We cracked the Google algorithm update...', 'Full content goes here...', 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80', 'Priya Mehta'],
            ['Instagram Reels Strategy for 2M Views', 'Social Media', 'No paid boost. No influencer. Just the right hook...', 'Full content goes here...', 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80', 'Ananya Kapoor']
        ];

        await connection.query('DELETE FROM blog_posts');
        for (const b of blogsData) {
            await connection.query('INSERT INTO blog_posts (title, category, excerpt, content, image, author) VALUES (?,?,?,?,?,?)', b);
        }

        // 6. Clients
        const clientsData = [
            [
                'techcorp', 
                'password123', 
                'TechCorp Industries', 
                'contact@techcorp.com', 
                'SEO Optimization Phase 2', 
                JSON.stringify({
                    seoScore: 85,
                    trafficGrowth: '+24%',
                    recentMilestone: 'Keyword Ranking Improved',
                    nextSteps: 'Backlink Campaign starting next week'
                })
            ]
        ];

        await connection.query('DELETE FROM clients');
        for (const c of clientsData) {
            await connection.query('INSERT INTO clients (username, password, name, email, project_status, project_details) VALUES (?,?,?,?,?,?)', c);
        }

        await connection.query(`
            CREATE TABLE IF NOT EXISTS invoices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT,
                amount DECIMAL(10,2),
                status VARCHAR(50) DEFAULT 'pending',
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            )
        `);
        console.log('Invoices table created');

        // Phase 12: Ultimate Agency Features
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                status VARCHAR(50) DEFAULT 'todo',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            )
        `);
        console.log('Tasks table created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS proposals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                price DECIMAL(10,2),
                status VARCHAR(50) DEFAULT 'sent',
                signature_data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            )
        `);
        console.log('Proposals table created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS client_vault (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT,
                platform VARCHAR(100) NOT NULL,
                username VARCHAR(255) NOT NULL,
                password_encrypted TEXT NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            )
        `);
        console.log('Client Vault table created');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS content_calendar (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT,
                platform VARCHAR(100) NOT NULL,
                post_date DATE NOT NULL,
                post_time TIME NOT NULL,
                caption TEXT NOT NULL,
                image_url VARCHAR(255),
                status VARCHAR(50) DEFAULT 'scheduled',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            )
        `);
        console.log('Content Calendar table created');

        // 7. Invoices
        const invoicesData = [
            [
                'TechCorp Industries', 
                'contact@techcorp.com', 
                'Monthly SEO & PPC Management', 
                1500.00, 
                'Pending', 
                new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
            ]
        ];

        await connection.query('DELETE FROM invoices');
        for (const i of invoicesData) {
            await connection.query('INSERT INTO invoices (client_name, client_email, service_details, amount, status, due_date) VALUES (?,?,?,?,?,?)', i);
        }

        // Fetch the inserted client ID for techcorp
        const [clientRows] = await connection.query("SELECT id FROM clients WHERE username = 'techcorp'");
        const techcorpId = clientRows.length ? clientRows[0].id : 1;

        const proposalsData = [
            [techcorpId, '6-Month Comprehensive SEO & Content Strategy', '1. Scope of Work:\n- Keyword Research\n- 4 Blog Posts / month\n- On-page Optimization\n\n2. Timeline:\n6 Months\n\n3. Terms:\nPayment is due beginning of each month.', 2500, 'sent']
        ];
        
        await connection.query('DELETE FROM proposals');
        for (const p of proposalsData) {
            await connection.query('INSERT INTO proposals (client_id, title, content, price, status) VALUES (?,?,?,?,?)', p);
        }

        // Seed Tasks
        const tasksData = [
            [techcorpId, 'Perform Technical SEO Audit', 'Check site speed and mobile friendliness.', 'done'],
            [techcorpId, 'Draft October Content Calendar', 'Plan out 12 posts for Instagram.', 'review'],
            [techcorpId, 'Setup Facebook Pixel', 'Integrate pixel on the landing page.', 'in-progress'],
            [techcorpId, 'Competitor Analysis', 'Analyze top 3 competitors.', 'todo']
        ];

        await connection.query('DELETE FROM tasks');
        for (const t of tasksData) {
            await connection.query('INSERT INTO tasks (client_id, title, description, status) VALUES (?,?,?,?)', t);
        }

        // Seed Client Vault
        // password is 'password123' encrypted with our crypto logic (we will just mock it for seed, or better, the admin can add it through UI. Let's just insert a mock encrypted string that won't decrypt correctly but will show in UI).
        const dummyEncrypted = '4a3b2c1d:5e6f7g8h9i0j';
        await connection.query('DELETE FROM client_vault');
        await connection.query('INSERT INTO client_vault (client_id, platform, username, password_encrypted, notes) VALUES (?,?,?,?,?)', 
            [techcorpId, 'Facebook Ads Manager', 'contact@techcorp.com', dummyEncrypted, 'Client personal FB account attached']
        );

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
        process.exit(0);
    }
}

seedDatabase();
