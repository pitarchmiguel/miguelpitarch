import { useEffect } from 'react'

/**
 * Progressive-enhancement layer: Lenis smooth scroll, a magnetic custom
 * cursor, and count-up stats, driven by GSAP. Everything is additive —
 * if this never runs (or reduced motion), the page still works with its
 * CSS reveals. Renders the cursor markup.
 */
export default function SiteExperience() {
  useEffect(() => {
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      new URLSearchParams(location.search).has('static')
    if (reduced) return

    let cleanup = () => {}
    let cancelled = false

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
    ]).then(([gsapMod, stMod, lenisMod]) => {
      if (cancelled) return
      const gsap = gsapMod.default
      const ScrollTrigger = stMod.ScrollTrigger
      const Lenis = lenisMod.default
      gsap.registerPlugin(ScrollTrigger)

      /* ── smooth scroll ── */
      const lenis = new Lenis({ lerp: 0.09 })
      lenis.on('scroll', ScrollTrigger.update)
      const ticker = (t) => lenis.raf(t * 1000)
      gsap.ticker.add(ticker)
      gsap.ticker.lagSmoothing(0)

      const anchorHandlers = []
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        const href = a.getAttribute('href')
        if (!href || href === '#') return
        const handler = (e) => {
          const target = document.querySelector(href)
          if (!target) return
          e.preventDefault()
          lenis.scrollTo(target, { duration: 1.4 })
        }
        a.addEventListener('click', handler)
        anchorHandlers.push([a, handler])
      })

      /* ── count-up stats ── */
      document.querySelectorAll('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate() {
            el.textContent = String(Math.round(obj.v))
          },
        })
      })

      /* ── magnetic elements ── */
      const magHandlers = []
      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        const move = (e) => {
          const r = el.getBoundingClientRect()
          gsap.to(el, {
            x: (e.clientX - r.left - r.width / 2) * 0.3,
            y: (e.clientY - r.top - r.height / 2) * 0.3,
            duration: 0.6,
            ease: 'power3.out',
          })
        }
        const leave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.4)' })
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        magHandlers.push([el, 'pointermove', move], [el, 'pointerleave', leave])
      })

      /* ── custom cursor ── */
      const fine = window.matchMedia('(pointer: fine)').matches
      const cursor = document.getElementById('cursor')
      let removeCursor = () => {}
      if (fine && cursor) {
        cursor.style.display = 'block'
        const pos = { x: innerWidth / 2, y: innerHeight / 2 }
        const tgt = { ...pos }
        const setX = gsap.quickSetter(cursor, 'x', 'px')
        const setY = gsap.quickSetter(cursor, 'y', 'px')
        const onMove = (e) => {
          tgt.x = e.clientX
          tgt.y = e.clientY
        }
        window.addEventListener('pointermove', onMove)
        const tick = () => {
          pos.x += (tgt.x - pos.x) * 0.18
          pos.y += (tgt.y - pos.y) * 0.18
          setX(pos.x)
          setY(pos.y)
        }
        gsap.ticker.add(tick)

        const hoverEls = document.querySelectorAll('a, button, [data-magnetic]')
        const enter = () => cursor.classList.add('is-hover')
        const leave = () => cursor.classList.remove('is-hover')
        hoverEls.forEach((el) => {
          el.addEventListener('pointerenter', enter)
          el.addEventListener('pointerleave', leave)
        })

        removeCursor = () => {
          window.removeEventListener('pointermove', onMove)
          gsap.ticker.remove(tick)
          hoverEls.forEach((el) => {
            el.removeEventListener('pointerenter', enter)
            el.removeEventListener('pointerleave', leave)
          })
        }
      }

      ScrollTrigger.refresh()

      cleanup = () => {
        gsap.ticker.remove(ticker)
        lenis.destroy()
        anchorHandlers.forEach(([el, h]) => el.removeEventListener('click', h))
        magHandlers.forEach(([el, type, h]) => el.removeEventListener(type, h))
        removeCursor()
        ScrollTrigger.getAll().forEach((s) => s.kill())
      }
    })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <div className="cursor" id="cursor" aria-hidden="true">
      <div className="cursor__dot" />
      <div className="cursor__ring" />
    </div>
  )
}
