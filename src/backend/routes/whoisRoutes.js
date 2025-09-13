import express from 'express';
import whois from 'whois-json';

const router = express.Router();

// WHOIS lookup endpoint
router.post('/whois', async (req, res) => {
    // Check for Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    // Optionally, verify the token here (e.g., with JWT)
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }

    const { domain } = req.body;
    if (!domain || typeof domain !== 'string') {
        return res.status(400).json({ error: 'Domain is required and must be a string.' });
    }
    try {
        const result = await whois(domain);
        res.json({ whois: result });
    } catch (err) {
        res.status(500).json({ error: 'WHOIS lookup failed.', details: err.message });
    }
});

export default router;
