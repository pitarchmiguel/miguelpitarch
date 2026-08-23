import { useEffect } from 'react'
import './index.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Services from './components/Services'
import Process from './components/Process'
import Work from './components/Work'
import Testimonials from './components/Testimonials'
import Faq from './components/Faq'
import Contact from './components/Contact'
import InfoStrip from './components/InfoStrip'
import SiteExperience from './components/SiteExperience'

export default function App() {
  // Scroll-reveal: fade/slide elements in, and run the hero's line-by-line reveal.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' })

    document.querySelectorAll('.reveal, .hero h1 .line').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <SiteExperience />
      <Nav />
      <Hero />

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          <span>Web design <i>·</i> Landing pages <i>·</i> Visual identity <i>·</i> Hand-coded <i>·</i> Lighthouse 100 <i>·</i>&nbsp;</span>
          <span>Web design <i>·</i> Landing pages <i>·</i> Visual identity <i>·</i> Hand-coded <i>·</i> Lighthouse 100 <i>·</i>&nbsp;</span>
        </div>
      </div>

      <Services />
      <Process />
      <Work />
      <Testimonials />
      <Faq />
      <Contact />
      <InfoStrip />
    </>
  )
}
