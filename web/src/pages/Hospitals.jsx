import React, { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Hospitals() {
  const [city, setCity] = useState('')
  const [hospitals, setHospitals] = useState([])
  const cities = ['','New Delhi','Mumbai','Bengaluru','Chennai','Pune','Gurgaon','Vellore','Chandigarh','Lucknow']

  useEffect(() => {
    if (!city) return
    fetch(`${apiBase}/api/hospitals?city=${encodeURIComponent(city)}`).then(r => r.json()).then(setHospitals).catch(() => setHospitals([]))
  }, [city])

  return (
    <div>
      <h3>Hospitals</h3>
      <div>
        <select value={city} onChange={e => setCity(e.target.value)}>
          {cities.map(c => <option key={c} value={c}>{c || 'Select city'}</option>)}
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        {hospitals.map(h => (
          <div key={h.id} style={{ border: '1px solid #eee', padding: 8, marginBottom: 6 }}>
            <strong>{h.name}</strong>
            <div>{h.address} — {h.city}</div>
            <div>{h.phone}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
