const express = require('express');
const router = express.Router();
const db = require('../db/connection').promise();
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
// In a real app, ENCRYPTION_KEY should be set in .env securely
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'super_secret_techdigi_key_123', 'salt', 32);

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
    try {
        const parts = text.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const encryptedText = Buffer.from(parts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch(err) {
        return "Decryption Error";
    }
}

// Admin: Get all vault entries decrypted
router.get('/admin', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT v.*, c.name as client_name, c.email as client_email FROM client_vault v JOIN clients c ON v.client_id = c.id ORDER BY v.created_at DESC');
        
        // Decrypt passwords for admin view
        const decryptedRows = rows.map(r => ({
            ...r,
            password_decrypted: decrypt(r.password_encrypted)
        }));
        
        res.json(decryptedRows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching vault' });
    }
});

// Client: Get their own vault entries (WITHOUT decrypted passwords for security, they just see they added it)
router.get('/client/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, platform, username, notes, created_at FROM client_vault WHERE client_id = ? ORDER BY created_at DESC', [req.params.id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add credential to vault
router.post('/', async (req, res) => {
    try {
        const { client_id, platform, username, password, notes } = req.body;
        if(!client_id || !platform || !username || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const encryptedPass = encrypt(password);

        const [result] = await db.query(
            'INSERT INTO client_vault (client_id, platform, username, password_encrypted, notes) VALUES (?, ?, ?, ?, ?)',
            [client_id, platform, username, encryptedPass, notes || '']
        );
        res.json({ id: result.insertId, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add to vault' });
    }
});

// Delete credential
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM client_vault WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete' });
    }
});

module.exports = router;
