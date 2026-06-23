const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access Denied. No token provided.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'supersecrettechdigikey123');
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Access Denied. Admin privileges required.' });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };
