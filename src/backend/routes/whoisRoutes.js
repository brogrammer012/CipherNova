import express from 'express';
import whois from 'whois-json';
import { calculateWhoisRisk } from '../utils/whoisRiskScore.js';

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
        const risk = calculateWhoisRisk(result);
        // Extract only required fields
        const filtered = {
            domainName: result.domainName,
            registryDomainId: result.registryDomainId,
            updatedDate: result.updatedDate,
            creationDate: result.creationDate,
            registryExpiryDate: result.registryExpiryDate,
            registrarRegistrationExpirationDate: result.registrarRegistrationExpirationDate,
            registrar: result.registrar,
            registrarIanaId: result.registrarIanaId,
            domainStatus: result.domainStatus
        };
        // Map riskScore to 0/25/50/75/100
        let scoreMap = {0:0,1:25,2:50,3:75,4:100};
        const mappedScore = scoreMap[risk.score] ?? 0;
        res.json({
            whois: filtered,
            riskLevel: risk.riskLevel,
            riskScore: mappedScore,
            riskMessage: risk.message,
            suspiciousElements: risk.score > 0 ? risk.message : '',
            securityFlags: risk.riskMessage
        });
    } catch (err) {
        res.status(500).json({ error: 'WHOIS lookup failed.', details: err.message });
    }
});

export default router;
