const fs = require('fs')
const path = require('path')

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\(\)]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function loadDictionary() {
  const p = path.join(__dirname, '..', 'data', 'diseases.json')
  const raw = fs.readFileSync(p, 'utf8')
  return JSON.parse(raw)
}

function scoreEntry(tokens, entry) {
  const hay = [entry.title || '', entry.content || '', (entry.tags || []).join(' ')].join(' ')
  const hayTokens = tokenize(hay)
  const haySet = new Set(hayTokens)
  let score = 0
  tokens.forEach(t => { if (haySet.has(t)) score += 1 })
  return score
}

function extractSnippet(entry, tokens) {
  // Try to find a sentence containing any token, otherwise return start of content
  const content = (entry.content || '').trim()
  if (!content) return ''
  const sentences = content.split(/(?<=[.!?])\s+/)
  for (const s of sentences) {
    const sTokens = tokenize(s)
    for (const t of tokens) {
      if (sTokens.includes(t)) return s.trim()
    }
  }
  // fallback: return first 120 chars
  return content.slice(0, 120) + (content.length > 120 ? '...' : '')
}

function searchDictionaries(query, topK = 2) {
  const tokens = tokenize(query)
  const dict = loadDictionary()
  const scored = dict.map(e => ({ entry: e, score: scoreEntry(tokens, e) }))
  scored.sort((a, b) => b.score - a.score)
  const top = scored.slice(0, topK).map(s => s.entry)
  const results = top.map(e => ({ id: e.id, title: e.title, snippet: extractSnippet(e, tokens) }))
  return results
}

module.exports = { searchDictionaries }
