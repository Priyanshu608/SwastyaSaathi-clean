const express = require('express')
const router = express.Router()
const { searchDictionaries } = require('../lib/rag')
const { askLocalLLM } = require('../lib/llm')

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message = '', city, age } = req.body || {}
    if (!message) return res.status(200).json({ reply: 'Please provide a message describing symptoms or questions.', sources: [], llm_used: false })

    const sources = searchDictionaries(message, 3) // evidence snippets

    // Build system messages with evidence for LLM
    const evidenceText = sources.map(s => `- ${s.title}: ${s.snippet}`).join('\n')
    const messages = [
      { role: 'system', content: 'You are a helpful Indian medical assistant. Use evidence below to ground answers. If not supported, be honest and advise seeing a doctor.' },
      { role: 'system', content: `EVIDENCE:\n${evidenceText}` },
      { role: 'user', content: `User message: ${message}. City: ${city || 'unknown'}. Age: ${age || 'unknown'}. Provide concise, India-specific, actionable guidance and cite sources by title.` }
    ]

    // Try to ask local LLM
    try {
      const { text } = await askLocalLLM(messages, { max_tokens: 400 })
      const reply = (text && text.trim()) ? text.trim() : sources.map((s, idx) => `${idx+1}. ${s.title}: ${s.snippet}`).join('\n\n')
      return res.json({ reply, sources, llm_used: true })
    } catch (llmErr) {
      // LLM failed - fallback to RAG-only reply
      console.warn('Local LLM call failed, falling back to RAG-only:', llmErr && llmErr.message)
      const reply = sources.length > 0 ? sources.map((s, idx) => `${idx+1}. ${s.title}: ${s.snippet}`).join('\n\n') : 'No local evidence found. Please consult a healthcare professional.'
      return res.json({ reply, sources, llm_used: false })
    }

  } catch (err) {
    console.error('chat error', err)
    return res.status(200).json({ reply: 'An error occurred while processing your request. Please try again later.', sources: [], llm_used: false })
  }
})

module.exports = router
