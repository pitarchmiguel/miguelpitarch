import { useEffect, useState } from 'react'

export default function InfoStrip() {
  const [clock, setClock] = useState('— : —')

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      setClock(`${hh} : ${mm} BST`)
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="info-strip">
      <span>Atelier Studio / Portfolio <span className="dot">●</span> Live</span>
      <span id="clock">{clock}</span>
      <span>Manchester, UK · 53.4808°N</span>
    </div>
  )
}
