import React from 'react'

export default function ChatBox({ messages = [] }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 8, minHeight: 200 }}>
      {messages.length === 0 && <div style={{ color: '#666' }}>No messages yet. Ask about symptoms or schemes.</div>}
      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontWeight: 'bold' }}>{m.role === 'user' ? 'You' : 'Assistant'}</div>
            {m.role === 'assistant' && (m.llm_used ? (
              <span style={{ background: '#d4f7dc', color: '#1a7a2e', padding: '2px 6px', borderRadius: 6, fontSize: 12 }}>LLM response</span>
            ) : (
              <span style={{ background: '#fff4e0', color: '#a86b00', padding: '2px 6px', borderRadius: 6, fontSize: 12 }}>RAG fallback</span>
            ))}
          </div>
          <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{m.text}</div>
          {m.sources && m.sources.length > 0 && (
            <div style={{ marginTop: 6 }}>
              {m.sources.map(s => (
                <div key={s.id} style={{ border: '1px solid #eee', padding: 6, marginBottom: 6, background: '#fafafa' }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: '#333' }}>{s.snippet}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
