const express = require('express');
const router = express.Router();
const rag = require('../lib/rag');

// POST /api/chat
router.post('/', (req, res) => {
  const { message = '', city, age } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message required' });

  const { results, reply } = rag.search(message, 2);
  const sources = results.map(r => ({ id: r.id, name: r.name }));

  // A short AI-like response assembled from snippets
  const assistantReply = reply || 'No relevant information found. Please consult a doctor for personalised advice.';

  res.json({ reply: assistantReply, sources });
});

module.exports = router;
