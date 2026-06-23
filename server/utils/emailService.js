const nodemailer = require('nodemailer');

// Create a transporter using SMTP
// User will need to configure these in their .env file
// Example for Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER=your_email, SMTP_PASS=your_app_password
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'dummy_user',
    pass: process.env.SMTP_PASS || 'dummy_pass'
  }
});

// Helper to check if SMTP is actually configured
const isSmtpConfigured = () => {
    return !!process.env.SMTP_USER;
};

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 */
const sendEmail = async (to, subject, html) => {
    try {
        if (!isSmtpConfigured()) {
            console.log(`\n\x1b[33m[EMAIL SIMULATION] Would have sent email to: ${to}\x1b[0m`);
            console.log(`\x1b[33mSubject: ${subject}\x1b[0m`);
            // We return true to simulate success during testing
            return true;
        }

        const info = await transporter.sendMail({
            from: `"Tech Digi" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

/**
 * Send auto-reply to a new lead
 * @param {string} name - Lead's name
 * @param {string} email - Lead's email
 */
const sendLeadAutoReply = async (name, email) => {
    const subject = "Thank you for contacting Tech Digi!";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #6366f1;">Hi ${name},</h2>
            <p>Thank you for reaching out to Tech Digi! We have received your inquiry and our team is currently reviewing it.</p>
            <p>One of our growth strategists will get back to you within the next 2 hours to discuss how we can help your business scale.</p>
            <p>In the meantime, feel free to reply to this email if you have any additional details to share.</p>
            <br/>
            <p>Best Regards,</p>
            <p><strong>The Tech Digi Team</strong></p>
            <a href="https://techdigi.com" style="color: #8b5cf6;">www.techdigi.com</a>
        </div>
    `;
    return sendEmail(email, subject, html);
};

module.exports = {
    sendEmail,
    sendLeadAutoReply
};
