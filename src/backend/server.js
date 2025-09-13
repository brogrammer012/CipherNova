import express from 'express';
import healthRoutes from './routes/healthCheck.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', healthRoutes);
app.use('/', userRoutes);


// Simple test route
app.get('/', (req, res) => {
    res.send('Server is running on port 3000!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
