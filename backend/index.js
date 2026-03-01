require('dotenv').config();
const express = require('express');
const app = express();

const CLIENT_SECRET = process.env.CLIENT_SECRET || 'nothing here :)';

app.get('/', (req, res) => {
    res.json({ message: "To view the app, please change url to localhost:4200" });
});

app.get('/apiWeather', (req, res) => {
    if (req.query.secret !== CLIENT_SECRET) {
        return res.status(403).json({ error: 'forbidden' });
    }
    res.json({ apiKey: process.env.API_KEY });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});