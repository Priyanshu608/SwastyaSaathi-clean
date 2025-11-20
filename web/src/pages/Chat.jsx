import React, { useState } from 'react'
import ChatBox from '../components/ChatBox'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  async function send() {
    if (!text.trim()) return
    const userMsg = { role: 'user', text }
    setMessages(m => [...m, userMsg])
    setText('')

    try {
      const res = await fetch(`${apiBase}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      })
      const data = await res.json()
      const assistantMsg = { role: 'assistant', text: data.reply || 'No reply', sources: data.sources || [] }
      setMessages(m => [...m, assistantMsg])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: 'Error contacting server.' }])
    }
  }

  return (
    <div>
      <h2>Chat</h2>
      <ChatBox messages={messages} />
      <div style={{ marginTop: 8 }}>
        <input value={text} onChange={e => setText(e.target.value)} style={{ width: '70%' }} />
        <button onClick={send} style={{ marginLeft: 8 }}>Send</button>
      </div>
    </div>
  )
}
