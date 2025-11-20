import React, { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Schemes() {
  const [schemes, setSchemes] = useState([])
  useEffect(() => {
    fetch(`${apiBase}/api/schemes`).then(r => r.json()).then(setSchemes).catch(() => setSchemes([]))
  }, [])

  return (
    <div>
      <h3>Government Schemes</h3>
      {schemes.map(s => (
        <div key={s.id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <strong>{s.name}</strong>
          <div>{s.summary}</div>
        </div>
      ))}
    </div>
  )
}
