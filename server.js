const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from any origin (your Netlify site)
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: system || '',
      messages
    });

    res.json(response);

  } catch (err) {
    console.error('Anthropic error:', err.message);
    res.status(500).json({ error: { message: err.message } });
  }
});

app.listen(PORT, () => {
  console.log(`WO Proxy running on port ${PORT}`);
});
