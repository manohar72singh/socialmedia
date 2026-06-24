require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function migrateDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'techdigi',
            ssl: process.env.DB_SSL === 'true' ? {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            } : undefined
        });

        console.log('Connected to MySQL. Running Premium migrations...');

        // Alter clients table to support tiers and stripe
        console.log('Altering clients table...');
        try {
            await connection.query(`ALTER TABLE clients ADD COLUMN tier ENUM('free', 'pro', 'enterprise') DEFAULT 'free'`);
        } catch (e) { console.log('Column tier may already exist', e.message); }
        
        try {
            await connection.query(`ALTER TABLE clients ADD COLUMN stripe_customer_id VARCHAR(255)`);
        } catch (e) { console.log('Column stripe_customer_id may already exist'); }

        try {
            await connection.query(`ALTER TABLE clients ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'inactive'`);
        } catch (e) { console.log('Column subscription_status may already exist'); }

        // Create subscriptions table for detailed tracking
        console.log('Creating subscriptions table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT NOT NULL,
                stripe_subscription_id VARCHAR(255),
                stripe_price_id VARCHAR(255),
                status VARCHAR(50),
                current_period_end TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            )
        `);

        // Create ai_usage table to track generation usage
        console.log('Creating ai_usage table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS ai_usage (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT NOT NULL,
                words_generated INT DEFAULT 0,
                requests_made INT DEFAULT 0,
                last_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            )
        `);

        console.log('Premium migrations completed successfully!');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    }
}

migrateDatabase();
