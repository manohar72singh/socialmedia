require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function setupDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'techdigi'
        });

        console.log('Connected to MySQL. Creating tables...');

        // 1. Portfolio Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS portfolio (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(100) NOT NULL,
                title VARCHAR(255) NOT NULL,
                industry VARCHAR(100),
                tag VARCHAR(100),
                description TEXT,
                image VARCHAR(500),
                metrics JSON,
                gradient VARCHAR(255),
                accentColor VARCHAR(50),
                duration VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Team Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS team (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(100) NOT NULL,
                emoji VARCHAR(10),
                bio TEXT,
                specialties JSON,
                gradient VARCHAR(255),
                bgColor VARCHAR(100),
                linkedin VARCHAR(255),
                stats JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. FAQs Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS faqs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category ENUM('general', 'pricing') DEFAULT 'general',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 4. Pricing Plans Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS pricing_plans (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                icon VARCHAR(50) DEFAULT 'Star',
                tagline VARCHAR(255),
                monthlyPrice INT NOT NULL,
                yearlyPrice INT NOT NULL,
                currency VARCHAR(10) DEFAULT '₹',
                color VARCHAR(255),
                glow VARCHAR(100),
                borderColor VARCHAR(100),
                popular BOOLEAN DEFAULT false,
                features JSON,
                cta VARCHAR(100) DEFAULT 'Get Started',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 5. Blog Posts Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                excerpt TEXT,
                content TEXT,
                image VARCHAR(500),
                author VARCHAR(100) DEFAULT 'Admin',
                status ENUM('draft', 'published', 'scheduled') DEFAULT 'published',
                scheduled_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 6. Leads Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                service VARCHAR(100),
                message TEXT,
                whatsapp_sent BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 7. Clients Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS clients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                project_status VARCHAR(50) DEFAULT 'In Progress',
                project_details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 8. Invoices Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS invoices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_name VARCHAR(255) NOT NULL,
                client_email VARCHAR(255) NOT NULL,
                service_details TEXT NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                due_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 9. Page Views Table (Real-time Analytics)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS page_views (
                id INT AUTO_INCREMENT PRIMARY KEY,
                path VARCHAR(255) NOT NULL,
                user_agent TEXT,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 10. Content Approvals Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS content_approvals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT NOT NULL,
                content_type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content_details TEXT NOT NULL,
                status ENUM('pending', 'approved', 'rejected', 'changes_requested') DEFAULT 'pending',
                feedback TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            )
        `);

        // 11. Email Campaigns Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS email_campaigns (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                target_audience VARCHAR(255),
                goal VARCHAR(255),
                sequence_data JSON NOT NULL,
                status VARCHAR(50) DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('All tables created successfully!');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error creating database tables:', error);
        process.exit(1);
    }
}

setupDatabase();
