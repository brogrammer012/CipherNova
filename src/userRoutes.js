// userRoutes.js
const express = require('express');
const router = express.Router();

// Utility function to check for phishing signals
function detectPhishingSignals(message) {
    const signals = [];
    // Urgent language
    const urgentPatterns = [
        /act now/i,
        /urgent/i,
        /immediately/i,
        /your account will be closed/i,
        /limited time/i,
        /final notice/i
    ];
    urgentPatterns.forEach(pattern => {
        if (pattern.test(message)) signals.push('Urgent language detected');
    });

    // Suspicious links
    const suspiciousLinkPatterns = [
        /https?:\/\/(bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly|buff\.ly|shorturl\.at)\/[\w\d]+/i,
        /https?:\/\/[^\s]+\.[^\s]+\.[^\s]+/i // double dot domain
    ];
    suspiciousLinkPatterns.forEach(pattern => {
        if (pattern.test(message)) signals.push('Suspicious link detected');
    });

    // Personal info requests
    const personalInfoPatterns = [
        /password/i,
        /id number/i,
        /social security/i,
        /bank account/i,
        /credit card/i,
        /pin/i
    ];
    personalInfoPatterns.forEach(pattern => {
        if (pattern.test(message)) signals.push('Personal info request detected');
    });

    // Too-good-to-be-true offers
    const offerPatterns = [
        /free money/i,
        /you have won/i,
        /prize/i,
        /claim now/i,
        /guaranteed/i,
        /risk[- ]?free/i
    ];
    offerPatterns.forEach(pattern => {
        if (pattern.test(message)) signals.push('Too-good-to-be-true offer detected');
    });

    return signals;
}


const { supabase } = require('./superbase');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register endpoint

router.post('/register', async (req, res) => {
    console.log('Register request body:', req.body);
    const { name, surname, email, password } = req.body;
    if (!name || !surname || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    // Check if email already exists
    const { data: userByEmail, error: emailError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
    if (userByEmail) {
        return res.status(409).json({ error: 'Email already exists.' });
    }
    // Insert new user
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, surname, email, password }]);
    if (error) {
        return res.status(500).json({ error: 'Registration failed.' });
    }
    res.status(201).json({ message: 'User registered successfully.' });
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
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
    if (error || !user) {
        console.log(`Login failed: Invalid credentials for email ${email}`);
        return res.status(401).json({ error: 'Invalid credentials.' });
    }
    if (user.password !== password) {
        console.log(`Login failed: Incorrect password for email ${email}`);
        return res.status(401).json({ error: 'Invalid credentials.' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`Login successful for email ${email}`);
    res.json({ message: 'Login successful.', token });
});

// Check phishing endpoint
router.post('/checkPhishing', (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required and must be a string.' });
    }
    const signals = detectPhishingSignals(message);
    res.json({ phishingSignals: signals, isPhishing: signals.length > 0 });
});

module.exports = router;
