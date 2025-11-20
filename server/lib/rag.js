const fs = require('fs');
const path = require('path');

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreItem(tokens, item) {
  const hay = [item.name || '', item.description || '', (item.symptoms || []).join(' ')].join(' ');
  const hayTokens = tokenize(hay);
  let score = 0;
  const haySet = new Set(hayTokens);
  tokens.forEach(t => { if (haySet.has(t)) score += 1; });
  return score;
}

function loadDiseases() {
  const p = path.join(__dirname, '..', 'data', 'diseases.json');
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

function search(message, top = 2) {
  const tokens = tokenize(message);
  const items = loadDiseases();
  const scored = items.map(it => ({ item: it, score: scoreItem(tokens, it) }));
  scored.sort((a, b) => b.score - a.score);
  const result = scored.slice(0, top).map(s => s.item).filter(Boolean);
  // Build a short reply combining top results
  const replyParts = result.map(r => `Possible: ${r.name}. ${r.description}`);
  return { results: result, reply: replyParts.join('\n\n') };
}

module.exports = { search };
