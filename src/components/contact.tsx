import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownLeft } from 'lucide-react';
import { LocalTime } from './local-time';

export function Contact() {
  return <footer id="contacto" className="contact-section text-white">
    <div className="contact-container">
      <div className="contact-heading flex justify-between items-center">
        <h2><span className="flex items-center"><Image className="contact-avatar" src="/profile.png" width={78} height={78} alt=""/>Hagamos</span><span>algo juntos.</span></h2>
        <ArrowDownLeft className="contact-arrow" size={24} strokeWidth={1.5} aria-hidden="true"/>
      </div>
      <div className="contact-rule"><a className="circle-button circle-blue" href="mailto:hello@miguelpitarch.com?subject=Hablemos%20de%20mi%20proyecto">Hablemos</a></div>
      <div className="contact-options flex flex-wrap gap-2"><a className="pill-button" href="mailto:hello@miguelpitarch.com">hello@miguelpitarch.com</a><a className="pill-button" href="https://github.com/pitarchmiguel" target="_blank" rel="noopener noreferrer">GitHub <span className="sr-only">(abre en otra pestaña)</span></a></div>
    </div>
    <div className="footer-meta flex flex-wrap justify-between">
      <div className="flex gap-10"><div><p className="eyebrow">Versión</p><p>STUDIO / 01 © 2026</p></div><div><p className="eyebrow">Hora local</p><LocalTime/></div></div>
      <div><p className="eyebrow">Conectemos</p><div className="flex gap-7"><a href="https://github.com/pitarchmiguel" target="_blank" rel="noopener noreferrer">GitHub</a><a href="mailto:hello@miguelpitarch.com">Email</a><Link href="/#inicio">Volver arriba</Link></div></div>
    </div>
  </footer>;
}
