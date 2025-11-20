import React, { useState, useRef } from 'react'
import ChatBox from '../components/ChatBox'
import { startRecognition, speak } from '../utils/speech'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const recogRef = useRef(null)

  function startMic() {
    if (listening) {
      if (recogRef.current) recogRef.current.stop()
      setListening(false)
      return
    }
    const controller = startRecognition((t) => {
      setText(prev => (prev ? prev + ' ' + t : t))
    })
    recogRef.current = controller
    setListening(true)
  }

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
      const assistantMsg = { role: 'assistant', text: data.reply || 'No reply', sources: data.sources || [], llm_used: !!data.llm_used }
      setMessages(m => [...m, assistantMsg])
      if (voiceOn && assistantMsg.text) speak(assistantMsg.text)
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: 'Error contacting server.' }])
    }
  }

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ marginBottom: 6, color: '#666', fontSize: 12 }}>Not medical advice. Consult a professional.</div>
      <ChatBox messages={messages} />
      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <input value={text} onChange={e => setText(e.target.value)} style={{ flex: 1 }} placeholder="Describe symptoms or ask a question" />
        <button onClick={startMic} title="Toggle microphone">{listening ? 'Stop Mic' : 'Start Mic'}</button>
        <button onClick={() => setVoiceOn(v => !v)} title="Toggle voice">{voiceOn ? 'Voice ON' : 'Voice OFF'}</button>
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}
