import React from 'react'

export default function ChatBox({ messages = [] }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 8, minHeight: 200 }}>
      {messages.length === 0 && <div style={{ color: '#666' }}>No messages yet. Ask about symptoms or schemes.</div>}
      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 'bold' }}>{m.role === 'user' ? 'You' : 'Assistant'}</div>
          <div>{m.text}</div>
          {m.sources && m.sources.length > 0 && (
            <div style={{ fontSize: 12, color: '#333' }}>
              Sources: {m.sources.map(s => s.name || s.id).join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
