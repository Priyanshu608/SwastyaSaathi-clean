const fetch = require('node-fetch')

/**
 * askLocalLLM - send messages to a local OpenAI-compatible LLM endpoint (LM Studio / GPT4All local server)
 * @param {Array} messages - OpenAI-compatible messages array [{role, content}]
 * @param {Object} options - { model, max_tokens }
 * @returns {Promise<{text:string, raw:object}>}
 */
async function askLocalLLM(messages, options = {}) {
  const url = process.env.LMSTUDIO_URL
  if (!url) throw new Error('LMSTUDIO_URL not configured')

  const body = {
    model: options.model || 'gpt-4o-mini',
    messages: messages,
    max_tokens: options.max_tokens || 300
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    timeout: options.timeout || 10000
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`LLM request failed: ${res.status} ${res.statusText} - ${txt}`)
    err.status = res.status
    throw err
  }

  const data = await res.json().catch(() => null)
  // Try to handle OpenAI-compatible shapes
  let text = ''
  if (data) {
    if (Array.isArray(data.choices) && data.choices[0]) {
      if (data.choices[0].message && data.choices[0].message.content) {
        text = data.choices[0].message.content
      } else if (data.choices[0].text) {
        text = data.choices[0].text
      }
    } else if (data.output && data.output[0] && data.output[0].content) {
      // other possible shapes
      text = data.output[0].content
    }
  }

  return { text: text || '', raw: data }
}

module.exports = { askLocalLLM }
