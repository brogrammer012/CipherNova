// server.js
require('dotenv').config({ path: '.env' });
const express = require('express');
const userRoutes = require('./src/userRoutes');
const app = express();

app.use(express.json());
app.use('/api/user', userRoutes);

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
