const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
});

app.post('/proxy', async (req, res) => {
    const { url } = req.body;
    const apiKey = process.env.APOLLO_API_KEY;
    const apiUrl = 'https://api.apollo.io/v1/people/match';
    try {
        const response = await axios.post(apiUrl, { linkedin_url: url }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': apiKey
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching email:', error);
        res.status(500).json({ error: 'Error fetching email' });
    }
});

app.post('/prospeo', async (req, res) => {
    const { url } = req.body;
    const apiKey = process.env.PROSPEO_API_KEY;
    const apiUrl = 'https://api.prospeo.io/linkedin-email-finder';
    try {
        const response = await axios.post(apiUrl, { url: url }, {
            headers: {
                'Content-Type': 'application/json',
                'X-KEY': apiKey
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching email from Prospeo:', error);
        res.status(500).json({ error: 'Error fetching email from Prospeo' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});