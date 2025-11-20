import React from 'react'
import { createRoot } from 'react-dom/client'
import Chat from './pages/Chat'
import Schemes from './pages/Schemes'
import Hospitals from './pages/Hospitals'

const App = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>SwastyaSaathi</h1>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}><Chat /></div>
        <div style={{ width: 360 }}>
          <h3>Quick Links</h3>
          <Schemes />
          <Hospitals />
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
