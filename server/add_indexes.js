require('dotenv').config();
const mysql = require('mysql2/promise');

async function addIndexes() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'techdigi'
        });

        console.log('Connected to MySQL. Adding indexes...');

        const queries = [
            'ALTER TABLE portfolio ADD INDEX idx_category (category);',
            'ALTER TABLE blog_posts ADD INDEX idx_category (category);',
            'ALTER TABLE faqs ADD INDEX idx_category (category);'
        ];

        for (let query of queries) {
            try {
                await connection.query(query);
                console.log(`Executed: ${query}`);
            } catch (err) {
                if (err.code === 'ER_DUP_KEYNAME') {
                    console.log(`Index already exists for query: ${query}`);
                } else {
                    console.error(`Error executing ${query}:`, err.message);
                }
            }
        }

        console.log('Indexes added successfully!');
    } catch (error) {
        console.error('Database connection error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
        process.exit(0);
    }
}

addIndexes();
