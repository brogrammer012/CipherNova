import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/healthCheck.js';
import userRoutes from './routes/userRoutes.js';
import communityRoutes from './routes/communityRoute.js';
import urlRoutes from './routes/urlRoutes.js'; 

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

const app = express();
const PORT = 3000;

const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3001';
app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', healthRoutes);
app.use('/', userRoutes);
app.use('/', communityRoutes);
app.use('/', urlRoutes);
// Simple test route
app.get('/', (req, res) => {
    res.send('Server is running on port 3000!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});