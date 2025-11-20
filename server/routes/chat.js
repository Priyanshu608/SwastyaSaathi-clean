const express = require('express')
const router = express.Router()
const { searchDictionaries } = require('../lib/rag')

// POST /api/chat
router.post('/', (req, res) => {
  try {
    const { message = '', city, age } = req.body || {}
    if (!message) return res.status(200).json({ reply: 'Please provide a message describing symptoms or questions.', sources: [] })

    const sources = searchDictionaries(message, 3) // get top 3

    // Build a human-friendly reply summarizing matches
    let reply = ''
    if (sources.length === 0) {
      reply = 'I could not find close matches in the local knowledge base. Please consult a healthcare professional for personalised advice.'
    } else {
      reply = sources.map((s, idx) => `${idx + 1}. ${s.title}: ${s.snippet}`).join('\n\n')
    }

    return res.json({ reply, sources })
  } catch (err) {
    console.error('chat error', err)
    return res.status(200).json({ reply: 'An error occurred while searching local knowledge. Please try again later.', sources: [] })
  }
})

module.exports = router
