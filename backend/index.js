require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error('Missing API_KEY in env');
  process.exit(1);
}

const RAPIDAPI_HEADERS = {
  'x-rapidapi-host': 'open-weather13.p.rapidapi.com',
  'x-rapidapi-key': API_KEY,
};

async function forward(req, res, url) {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const r = await fetch(url, {
        headers: RAPIDAPI_HEADERS,
        signal: AbortSignal.timeout(15000),
      });
      const data = await r.json();
      if (!r.ok) {
        console.error('RapidAPI error', r.status, data);
        return res.status(r.status === 200 ? 502 : r.status).json({ error: data });
      }
      return res.json(data);
    } catch (err) {
      const isTimeout =
        err?.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
        err?.name === 'TimeoutError';
      console.warn(`Attempt ${attempt}/${MAX_RETRIES} failed:`, err?.message);
      if (attempt === MAX_RETRIES || !isTimeout) {
        console.error('Backend fetch error', err);
        return res.status(500).json({ error: 'backend request failed', detail: err?.message });
      }
      await new Promise(resolve => setTimeout(resolve, 500 * attempt));
    }
  }
}

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'city required' });
  const url = `https://open-weather13.p.rapidapi.com/city?city=${encodeURIComponent(city)}&lang=EN`;
  await forward(req, res, url);
});

app.get('/api/weather5', async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;
  if (!lat || !lon) return res.status(400).json({ error: 'lat/lon required' });
  const url = `https://open-weather13.p.rapidapi.com/fivedaysforcast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&lang=EN`;
  await forward(req, res, url);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  fetch('https://open-weather13.p.rapidapi.com/city?city=London&lang=EN', {
    headers: RAPIDAPI_HEADERS,
    signal: AbortSignal.timeout(8000),
  })
    .then(() => console.log('Warmup OK'))
    .catch(() => console.log('Warmup failed'));
});