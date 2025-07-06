// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Usar variable de entorno para la API key
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openrouter/cypher-alpha:free',
      messages: [
        { role: 'system', content: 'Eres un asistente experto en ética tecnológica y humanismo. Responde de forma clara, breve y educativa.' },
        { role: 'user', content: userMessage }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = response.data;
    if (data.choices && data.choices[0] && data.choices[0].message) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      console.error('OpenRouter API error:', data);
      res.status(500).json({ error: 'No response from OpenRouter', details: data });
    }
  } catch (err) {
    console.error('Error contacting OpenRouter:', err);
    res.status(500).json({ error: 'Error contacting OpenRouter', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
}); 