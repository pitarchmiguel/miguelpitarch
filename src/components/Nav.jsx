import { useEffect, useRef } from 'react'

export default function Nav() {
  const navRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle('scrolled', window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className="top" ref={navRef}>
      <div className="wrap inner">
        <a href="#" className="logo">Miguel<span className="dot"></span><em>Pitarch</em></a>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#faq">FAQ</a>
          <a href="#contact" className="cta">Start a project →</a>
        </div>
      </div>
    </nav>
  )
}
