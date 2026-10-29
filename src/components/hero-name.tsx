'use client';

import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function HeroName() {
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (track.current) track.current.dataset.ready = 'true';
    const hero = track.current?.closest('.hero');
    if (!hero || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return <>
    <div className="hero-name"><div ref={track} className="name-track" style={{ animationPlayState: paused || !inView ? 'paused' : 'running' }}>
      <h1>Miguel Pitarch <span aria-hidden="true">—</span></h1>
      <div className="name-copy" aria-hidden="true">Miguel Pitarch <span>—</span></div>
    </div></div>
    <button className="motion-toggle" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Reanudar movimiento del nombre' : 'Pausar movimiento del nombre'} aria-pressed={paused}>
      {paused ? <Play size={13} aria-hidden="true"/> : <Pause size={13} aria-hidden="true"/>}<span>Movimiento</span>
    </button>
  </>;
}
