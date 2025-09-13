// server.js
import express from 'express';  // ES Modules syntax

const app = express();
const PORT = 3000;

// Simple test route
app.get('/', (req, res) => {
    res.send('Server is running on port 3000!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
