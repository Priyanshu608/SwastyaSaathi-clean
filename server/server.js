const express = require('express');
const cors = require('cors');
const path = require('path');

const chatRoutes = require('./routes/chat');
const schemesRoutes = require('./routes/schemes');
const hospitalsRoutes = require('./routes/hospitals');
const { searchDictionaries } = require('./lib/rag')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/hospitals', hospitalsRoutes);

const fetch = require('node-fetch')
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`SwastyaSaathi server listening on port ${PORT}`);
  // Smoke test: run a quick RAG search and log results
  try {
    const sample = searchDictionaries('fever and rash', 2)
    console.log('RAG smoke test results:', sample)
  } catch (e) {
    console.warn('RAG smoke test failed:', e && e.message)
  }

  // Check LM Studio reachability if configured
  const lmUrl = process.env.LMSTUDIO_URL
  if (lmUrl) {
    try {
      const resp = await fetch(lmUrl, { method: 'HEAD', timeout: 3000 })
      if (resp.ok) console.log('LM Studio reachable at', lmUrl)
      else console.warn('LM Studio responded with', resp.status)
    } catch (err) {
      console.warn('LM Studio unreachable — using RAG fallback. URL:', lmUrl)
    }
  } else {
    console.log('LMSTUDIO_URL not set; using RAG-only fallback')
  }
});

module.exports = app;
