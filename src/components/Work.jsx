import { useEffect, useRef } from 'react'

const CASES = [
  {
    name: 'Pelago Coffee Co. ', em: '— shop landing', yr: '2025 / 09',
    summary: 'A single-page shop for a specialty roaster. Editorial hero, live stock, subscription flow in four clicks.',
    result: '+42% subscription signups · paid for itself in 9 days.',
    art: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#2a2620" />
        <circle cx="200" cy="150" r="58" fill="#d9a57a" />
        <circle cx="200" cy="150" r="28" fill="#2a2620" />
        <text x="40" y="50" fill="#d9a57a" fontFamily="serif" fontStyle="italic" fontSize="20">Pelago</text>
        <text x="40" y="270" fill="#8a7a6a" fontFamily="monospace" fontSize="9" letterSpacing="2">COFFEE CO. — EST. 2021</text>
      </svg>
    ),
  },
  {
    name: 'Northbound ', em: '— seed site', yr: '2026 / 01',
    summary: 'A credible home for a two-person climate-tech team raising their seed round.',
    result: 'Closed round oversubscribed in 6 weeks.',
    art: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#eae5db" />
        <rect x="40" y="120" width="320" height="2" fill="#1c1a17" />
        <text x="40" y="110" fill="#1c1a17" fontFamily="serif" fontWeight="300" fontSize="42" letterSpacing="-1">Northbound.</text>
        <text x="40" y="150" fill="#7a7468" fontFamily="monospace" fontSize="9" letterSpacing="2">SERIES A · 2026</text>
        <rect x="40" y="220" width="80" height="24" rx="12" fill="#1c1a17" />
        <text x="54" y="237" fill="#eae5db" fontFamily="sans-serif" fontSize="10">Read deck →</text>
      </svg>
    ),
  },
  {
    name: 'Ferment ', em: '— DTC landing', yr: '2025 / 06',
    summary: 'A story-led page for a small-batch kombucha brand entering retail.',
    result: '3.1× email capture rate vs. previous site.',
    art: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#dfe3dc" />
        <circle cx="120" cy="150" r="70" fill="#5a7a5e" />
        <circle cx="170" cy="150" r="70" fill="#5a7a5e" opacity="0.6" />
        <text x="40" y="260" fill="#2f3d30" fontFamily="serif" fontStyle="italic" fontSize="22">Ferment — live cultures</text>
      </svg>
    ),
  },
  {
    name: 'Huxley Works ', em: '— studio site', yr: '2025 / 11',
    summary: 'A quiet practice page for an architecture studio. Typography as protagonist, photography the chorus.',
    result: '4 new project enquiries in month one.',
    art: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#16181c" />
        <rect x="40" y="40" width="160" height="1" fill="#d4a574" />
        <text x="40" y="130" fill="#f1ede4" fontFamily="serif" fontWeight="300" fontSize="40" letterSpacing="-1">A small</text>
        <text x="40" y="175" fill="#d4a574" fontFamily="serif" fontStyle="italic" fontWeight="300" fontSize="40">architecture</text>
        <text x="40" y="215" fill="#f1ede4" fontFamily="serif" fontWeight="300" fontSize="40">practice.</text>
        <text x="40" y="270" fill="#6a6860" fontFamily="monospace" fontSize="9" letterSpacing="2">HUXLEY WORKS · LONDON</text>
      </svg>
    ),
  },
]

export default function Work() {
  const gridRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tiltOn = !prefersReduced // shipped default: depth "on"

    const cleanups = []
    gridRef.current?.querySelectorAll('.case').forEach((card) => {
      const thumb = card.querySelector('.thumb')
      if (!thumb) return
      let shine = thumb.querySelector('.tilt-shine')
      if (!shine) {
        shine = document.createElement('div')
        shine.className = 'tilt-shine'
        thumb.appendChild(shine)
      }

      let raf = 0
      const onMove = (e) => {
        if (!tiltOn) return
        thumb.classList.add('tilting')
        const r = thumb.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        const rx = (0.5 - py) * 8.5
        const ry = (px - 0.5) * 11
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          thumb.style.transform = `translateY(-6px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
          shine.style.setProperty('--mx', (px * 100).toFixed(1) + '%')
          shine.style.setProperty('--my', (py * 100).toFixed(1) + '%')
        })
      }
      const onLeave = () => {
        card.classList.remove('tilting')
        thumb.classList.remove('tilting')
        thumb.style.transform = ''
      }
      thumb.addEventListener('pointermove', onMove)
      thumb.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        thumb.removeEventListener('pointermove', onMove)
        thumb.removeEventListener('pointerleave', onLeave)
        cancelAnimationFrame(raf)
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <section className="page" id="work">
      <div className="wrap">
        <div className="section-head">
          <div className="label">§ 03 — Selected work</div>
          <h2 className="display reveal">Pages that <span className="italic">earned</span> their keep.</h2>
        </div>

        <div className="work-grid" ref={gridRef}>
          {CASES.map((c, i) => (
            <article className="case reveal" data-d={i || undefined} key={c.name}>
              <div className="thumb">{c.art}</div>
              <div className="meta-row">
                <div className="name">{c.name}<em>{c.em}</em></div>
                <div className="yr">{c.yr}</div>
              </div>
              <p className="summary">{c.summary}</p>
              <p className="result">{c.result}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
