// routes/urlRoutes.js
import express from 'express';
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

export default router;
