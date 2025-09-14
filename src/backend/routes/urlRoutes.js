// routes/urlRoutes.js
import express from 'express';
import dns from 'dns/promises';
import validator from 'validator';
import {
  urlChecker,
  checkLookalike,
  noteSuspiciousTld,
  getMeta,
} from '../utils/urlRisk.js';

const router = express.Router();

/**
 * POST /check-url
 * Body: { url: string }
 *
 * Layer 1: Google Web Risk
 * Layer 2: Lookalike (Levenshtein against clean labels/domains)
 * Layer 3: Suspicious TLD note
 */
router.post('/check-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });

    // Layer 1: Web Risk
    const webrisk = await urlChecker(url);
    if (webrisk.result === 'BLOCK') return res.json(webrisk);

    // Layer 2: Lookalike
    const lookalike = checkLookalike(url);

    // Start conservative: LIKELY_LOOKALIKE -> REVIEW
    const result =
      lookalike.result === 'LIKELY_LOOKALIKE'
        ? 'REVIEW'
        : webrisk.result;

    // Layer 3: Suspicious TLD
    const tldNote = noteSuspiciousTld(url);

    // Meta
    const meta = getMeta();

    res.json({
      result,
      webrisk,
      lookalike,
      tldNote,
      meta,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/check-email', async (req, res) => {
  //console.log('Check email endpoint hit');
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ error: 'Valid email is required.' });
    }

    const domain = email.split('@')[1];
    let riskScore = 0;
    let issues = [];

    try {
        // 1. Check domain exists
        try {
            await dns.resolveMx(domain);
        } catch {
            riskScore += 2;
            issues.push('Domain does not have valid MX records.');
        }

        // 2. Check if domain is blacklisted
        const blacklist = ['spamdomain.com', 'malicious.com']; // example
        if (blacklist.includes(domain.toLowerCase())) {
            riskScore += 3;
            issues.push('Domain is on the blacklist.');
        }

        // 3. Check for suspicious patterns
        if (domain.match(/\d/) || domain.length > 20) {
            riskScore += 1;
            issues.push('Domain looks suspicious.');
        }

        // Determine risk level
        let riskLevel = 'LOW';
        if (riskScore >= 3) riskLevel = 'HIGH';
        else if (riskScore >= 1) riskLevel = 'MEDIUM';

        res.json({ email, riskLevel, riskScore, issues });
    } catch (err) {
        console.error('Error checking email:', err);
        res.status(500).json({ error: 'Failed to check email.', details: err.message });
    }
});


export default router;
