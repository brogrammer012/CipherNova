import express from 'express';
import healthRoutes from './routes/healthCheck.js';

const app = express();
const PORT = 3000;

app.use('/', healthRoutes);

// Simple test route
app.get('/', (req, res) => {
    res.send('Server is running on port 3000!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
