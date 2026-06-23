const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { sendEmail } = require('../utils/emailService');

// POST /api/bookings - Save a new appointment
router.post('/', async (req, res) => {
    const { name, email, date, time } = req.body;

    if (!name || !email || !date || !time) {
        return res.status(400).json({ error: 'Name, Email, Date, and Time are required' });
    }

    try {
        const insertQuery = 'INSERT INTO bookings (name, email, date, time) VALUES (?, ?, ?, ?)';
        pool.query(insertQuery, [name, email, date, time], async (err, results) => {
            if (err) {
                // Auto-create table if it doesn't exist
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    const createTableQuery = `
                        CREATE TABLE bookings (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(255) NOT NULL,
                            email VARCHAR(255) NOT NULL,
                            date DATE NOT NULL,
                            time VARCHAR(50) NOT NULL,
                            status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )
                    `;
                    pool.query(createTableQuery, (createErr) => {
                        if (createErr) return res.status(500).json({ error: 'Failed to create table' });
                        
                        // Retry insert
                        pool.query(insertQuery, [name, email, date, time], (retryErr) => {
                            if (retryErr) return res.status(500).json({ error: 'Failed to save booking' });
                            sendConfirmation(name, email, date, time, res);
                        });
                    });
                    return;
                }
                console.error('Error inserting booking:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            sendConfirmation(name, email, date, time, res);
        });
    } catch (e) {
        console.error("Workflow error:", e);
        res.status(500).json({ error: 'Server error' });
    }
});

async function sendConfirmation(name, email, date, time, res) {
    try {
        const adminHtml = `
            <h2>New Call Booked!</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
        `;
        await sendEmail('admin@techdigi.com', `New Appointment: ${name}`, adminHtml);

        const userHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #6366f1;">Hi ${name}, your call is booked!</h2>
                <p>Thank you for scheduling a call with Tech Digi.</p>
                <p>We are looking forward to speaking with you on <strong>${date}</strong> at <strong>${time}</strong>.</p>
                <p>We will send a calendar invite and meeting link shortly.</p>
                <br/>
                <p>Best Regards,</p>
                <p><strong>The Tech Digi Team</strong></p>
            </div>
        `;
        await sendEmail(email, "Your Tech Digi Call is Confirmed!", userHtml);

        return res.status(201).json({ message: 'Booking saved successfully' });
    } catch (err) {
        console.error('Email failed:', err);
        return res.status(201).json({ message: 'Booking saved (Email failed)' });
    }
}

// GET /api/bookings - Get all bookings (Admin)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM bookings ORDER BY created_at DESC';
    pool.query(query, (err, results) => {
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') return res.json([]);
            console.error('Error fetching bookings:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

module.exports = router;
