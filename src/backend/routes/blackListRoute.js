import express from 'express';
import pkg from '../database/supabaseClient.js';
const { supabase } = pkg;

const router = express.Router();

function detectType(value) {
    // simple heuristic: contains @ → EMAIL, otherwise URL
    return value.includes('@') ? 'EMAIL' : 'URL';
}

router.get('/check-blacklist', async (req, res) => {
    const { value } = req.query;

    if (!value) {
        return res.status(400).json({ error: 'Missing value to check' });
    }

    const type = detectType(value);

    try {
        const { data, error } = await supabase
            .from('Blacklist')
            .select('*')
            .eq('type', type)
            .eq('value', value);

        if (error) throw error;

        res.json({ isBlacklisted: data && data.length > 0 });
    } catch (err) {
        console.error('Error checking blacklist:', err);
        res.status(500).json({ error: 'Failed to check blacklist.', details: err.message });
    }
});

router.post('/add-to-blacklist', async (req, res) => {
    const { type, value } = req.body;

    if (!type || !value) {
        return res.status(400).json({ error: 'Missing type or value' });
    }

    const normalizedType = String(type).toUpperCase();
    if (!['URL', 'EMAIL'].includes(normalizedType)) {
        return res.status(400).json({ error: 'Invalid type. Allowed: URL, EMAIL' });
    }

    try {
        const { data, error } = await supabase
            .from('Blacklist')
            .insert([{ type: normalizedType, value }])
            .select();

        if (error) {
            console.error('Error inserting blacklist entry:', error);
            return res.status(500).json({ error: 'Failed to add to blacklist.', details: error.message });
        }

        res.status(201).json({ message: 'Entry added to blacklist.', entry: data[0] });
    } catch (err) {
        console.error('Error adding to blacklist:', err);
        res.status(500).json({ error: 'Failed to add to blacklist.', details: err.message });
    }
});

export default router;
