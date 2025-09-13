import express from 'express';
import pkg from '../database/supabaseClient.js';
const { supabase } = pkg;
import { detectPhishingSignals } from '../utils/detectPhishingSignals.js';
import whois from 'whois-json';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const router = express.Router();

// Register endpoint

router.post('/register', async (req, res) => {
    console.log('Register request body:', req.body);
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if email already exists
    const { data: userByEmail, error: emailError } = await supabase
        .from('Users')
        .select('id')
        .eq('email', email)
        .single();

    if (userByEmail) {
        return res.status(409).json({ error: 'Email already exists.' });
    }

    try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const { data, error } = await supabase
            .from('Users')
            .insert([{ name, surname, email, password: hashedPassword, status: 'Verified' }]);

        if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({ error: 'Registration failed.', details: error.message });
        }

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Hashing error:', err);
        res.status(500).json({ error: 'Registration failed.', details: err.message });
    }
});

// Login endpoint

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log('Login failed: Missing email or password');
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const { data: user, error } = await supabase
        .from('Users')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !user) {
        console.log(`Login failed: Invalid credentials for email ${email}`);
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    //Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        console.log(`Login failed: Incorrect password for email ${email}`);
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    console.log(`Login successful for email ${email}`);
    res.json({ message: 'Login successful.', token });
});

// Check phishing endpoint
router.post('/checkPhishing', (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
        return res.status(400).json({
            riskLevel: 'error',
            riskScore: 0,
            flags: ['Message is required and must be a string.'],
            suggestions: [],
            highlightedContent: '',
            detectedType: 'unknown'
        });
    }
    const signals = detectPhishingSignals(message);
    // Risk scoring logic (simple)
    let riskScore = signals.length * 25;
    let riskLevel = 'low';
    if (riskScore >= 50) riskLevel = 'high';
    else if (riskScore >= 25) riskLevel = 'medium';

    // Suggestions based on risk
    let suggestions = [];
    if (riskLevel === 'high') {
        suggestions = [
            'Do not interact with this content',
            'Delete immediately',
            'Report to your institution\'s IT security team',
            'Add to community blacklist to warn others'
        ];
    } else if (riskLevel === 'medium') {
        suggestions = [
            'Exercise caution before interacting',
            'Verify sender through official channels',
            'Do not provide personal information',
            'Consider reporting if suspicious'
        ];
    } else {
        suggestions = [
            'Content appears relatively safe',
            'Still verify sender if requesting information',
            'Trust your instincts if something feels off'
        ];
    }

    // Highlight signals in content
    let highlightedContent = message;
    signals.forEach(signal => {
        // Simple highlight: wrap signal keywords in <mark>
        const keyword = signal.split(' ')[0];
        highlightedContent = highlightedContent.replace(new RegExp(keyword, 'gi'), `<mark>${keyword}</mark>`);
    });

    // Detect type
    let detectedType = 'email';
    if (message.startsWith('http') || message.includes('www.')) detectedType = 'link';

    res.json({
        riskLevel,
        riskScore,
        flags: signals,
        suggestions,
        highlightedContent,
        detectedType
    });
});

export default router;