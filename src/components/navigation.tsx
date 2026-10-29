'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

const links = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#trabajos', label: 'Trabajos' },
  { href: '/#sobre-mi', label: 'Sobre mí' },
  { href: '/#contacto', label: 'Contacto' },
];

export function Navigation({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const previousOverflow = useRef('');

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 160);
    window.addEventListener('scroll', update, { passive: true });
    const timer = window.setTimeout(update, 0);
    return () => {
      window.removeEventListener('scroll', update);
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  function openMenu() {
    previousOverflow.current = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = 'hidden';
    setOpen(true);
  }

  function keepFocusInMenu(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
    if (!controls?.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function closeMenu() {
    dialog.current?.close();
  }

  return <>
    <header className={`site-header flex items-center justify-between ${dark ? 'header-dark' : ''}`}>
      <Link className="wordmark inline-flex items-center gap-2" href="/#inicio" aria-label="Miguel Pitarch, inicio"><span aria-hidden="true">©</span><span>Code by Miguel</span></Link>
      <nav className="desktop-nav flex items-center gap-10" aria-label="Navegación principal">
        {links.slice(1).map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
      <button className="mobile-menu items-center gap-2" onClick={openMenu} aria-expanded={open} aria-controls="navigation-dialog"><span className="menu-dot" aria-hidden="true"/>Menú</button>
    </header>
    <button className={`floating-menu ${scrolled ? 'is-visible' : ''}`} onClick={openMenu} aria-label="Abrir menú" aria-controls="navigation-dialog" aria-expanded={open} tabIndex={scrolled ? 0 : -1}><Menu size={25} strokeWidth={1}/></button>
    <dialog id="navigation-dialog" ref={dialog} className="navigation-dialog" onKeyDown={keepFocusInMenu} aria-labelledby="menu-title" onClick={event => { if (event.target === event.currentTarget) closeMenu(); }} onClose={() => { document.body.style.overflow = previousOverflow.current; setOpen(false); }}>
      <div className="drawer-content" onClick={event => event.stopPropagation()}>
        <button className="menu-close" onClick={closeMenu} aria-label="Cerrar menú"><X size={26} strokeWidth={1}/></button>
        <p id="menu-title" className="eyebrow">Navegación</p>
        <nav aria-label="Menú ampliado" className="drawer-links flex flex-col">
          {links.map(link => <Link href={link.href} key={link.href} onClick={closeMenu}>{link.label}</Link>)}
        </nav>
        <div className="drawer-bottom"><p className="eyebrow">Conectemos</p><div className="flex flex-wrap gap-6"><a href="https://github.com/pitarchmiguel" target="_blank" rel="noopener noreferrer">GitHub</a><a href="mailto:hello@miguelpitarch.com">Email</a></div></div>
      </div>
    </dialog>
  </>;
}
