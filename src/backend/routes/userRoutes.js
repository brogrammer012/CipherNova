import express from 'express';
import { supabase } from '../database/supabaseClient.js';
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
            .insert([{ name, surname, email, password: hashedPassword }]);

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
        return res.status(400).json({ error: 'Message is required and must be a string.' });
    }
    const signals = detectPhishingSignals(message);
    res.json({ phishingSignals: signals, isPhishing: signals.length > 0 });
});

export default router;