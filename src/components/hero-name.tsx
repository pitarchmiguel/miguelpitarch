'use client';

import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function HeroName() {
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    element.dataset.ready = 'true';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hero = element.closest('.hero');
    let observer: IntersectionObserver | undefined;
    if (hero && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
      observer.observe(hero);
    }
    let lastY = window.scrollY, direction = 1, rateFrame = 0;
    const prepare = () => {
      cancelAnimationFrame(rateFrame);
      lastY = window.scrollY; direction = 1;
      const animation = element.getAnimations()[0];
      if (!animation || reduced.matches) return;
      const duration = Number(animation.effect?.getTiming().duration);
      // Seed complete iterations so reverse playback cannot stop at time zero.
      if (Number.isFinite(duration)) animation.currentTime = duration * 1000;
      animation.updatePlaybackRate(1);
    };
    const changeDirection = () => {
      const delta = window.scrollY - lastY;
      lastY = window.scrollY;
      if (reduced.matches || Math.abs(delta) < 2) return;
      const next = delta > 0 ? 1 : -1;
      if (next === direction) return;
      direction = next;
      const animation = element.getAnimations()[0];
      if (!animation) return;
      cancelAnimationFrame(rateFrame);
      const startRate = animation.playbackRate, start = performance.now();
      const easeRate = (time: number) => {
        const progress = Math.min(1, (time - start) / 350);
        const eased = progress * progress * (3 - 2 * progress);
        animation.updatePlaybackRate(startRate + (next - startRate) * eased);
        if (progress < 1) rateFrame = requestAnimationFrame(easeRate);
      };
      rateFrame = requestAnimationFrame(easeRate);
    };
    prepare();
    reduced.addEventListener('change', prepare);
    window.addEventListener('scroll', changeDirection, { passive: true });
    return () => {
      observer?.disconnect(); cancelAnimationFrame(rateFrame);
      reduced.removeEventListener('change', prepare); window.removeEventListener('scroll', changeDirection);
    };
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
