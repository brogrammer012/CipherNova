import express from 'express';
import pkg from '../database/supabaseClient.js';
const { supabase } = pkg;


const router = express.Router();


router.get('/community', async (req, res) => {
    const { data, error } = await supabase
        .from('Community')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching community:', error);
        return res.status(500).json({ error: 'Failed to fetch community posts.' });
    }

    res.json(data);
});

// Get reports by a specific user
router.get('/reports/user/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('Reports')
            .select('id, url, detection_type, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error fetching reports:', error);
            return res.status(500).json({ error: 'Failed to fetch reports.', details: error.message });
        }

        res.json({ userId, reports: data });
    } catch (err) {
        console.error('Server error fetching reports:', err);
        res.status(500).json({ error: 'Server error fetching reports.', details: err.message });
    }
});

router.post('/submit-report', async (req, res) => {
    const { userId, url, detectionType } = req.body;
    if (!userId || !url || !detectionType) {
        return res.status(400).json({ error: 'User ID, URL, and detection type are required.' });
    }
    try {
        const { data, error } = await supabase
            .from('Reports')
            .insert([{ user_id: userId, url, detection_type: detectionType }])
            .select();
        if (error) {
            console.error('Supabase error inserting report:', error);
            return res.status(500).json({ error: 'Failed to submit report.', details: error.message });
        }

        res.status(201).json({ message: 'Report submitted successfully.', report: data[0] });
    } catch (err) {
        console.error('Server error submitting report:', err);
        res.status(500).json({ error: 'Server error submitting report.', details: err.message });
    }
});

export default router;