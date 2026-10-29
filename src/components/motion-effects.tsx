'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Progressive enhancement: content and navigation work without this controller. */
export function MotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let dispose = () => {};

    function setup() {
      dispose();
      if (reduced.matches) { dispose = () => {}; return; }
      const cleanups: (() => void)[] = [];
      const targets = document.querySelectorAll<HTMLElement>('.intro-container h2, .intro-aside p, .project-row, .contact-heading, .project-description');
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          });
        }, { rootMargin: '0px 0px -24px 0px', threshold: .05 });
        targets.forEach(element => {
          // Never hide content already on screen, including restored hash targets.
          if (element.getBoundingClientRect().top < innerHeight) return;
          element.classList.add('motion-reveal');
          observer.observe(element);
        });
        cleanups.push(() => {
          observer.disconnect();
          targets.forEach(element => element.classList.remove('motion-reveal', 'is-revealed'));
        });
      }
      if (finePointer.matches) {
        document.querySelectorAll<HTMLElement>('.circle-button, .pill-button').forEach(element => {
          const circular = element.classList.contains('circle-button');
          let frame = 0;
          let bounds: DOMRect | undefined;
          const enter = () => { bounds = element.getBoundingClientRect(); element.classList.remove('magnet-returning'); };
          const move = (event: PointerEvent) => {
            if (event.pointerType !== 'mouse') return;
            bounds ??= element.getBoundingClientRect();
            const x = event.clientX - bounds.left - bounds.width / 2;
            const y = event.clientY - bounds.top - bounds.height / 2;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              const strength = circular ? .48 : .14;
              const limit = circular ? 38 : 12;
              element.style.setProperty('--magnet-x', `${Math.max(-limit, Math.min(limit, x * strength))}px`);
              element.style.setProperty('--magnet-y', `${Math.max(-limit, Math.min(limit, y * strength))}px`);
              element.style.setProperty('--label-x', `${Math.max(-10, Math.min(10, x * .12))}px`);
              element.style.setProperty('--label-y', `${Math.max(-10, Math.min(10, y * .12))}px`);
            });
          };
          const leave = () => {
            cancelAnimationFrame(frame); bounds = undefined;
            element.classList.add('magnet-returning');
            for (const name of ['--magnet-x', '--magnet-y', '--label-x', '--label-y']) element.style.removeProperty(name);
          };
          element.addEventListener('pointerenter', enter);
          element.addEventListener('pointermove', move);
          element.addEventListener('pointerleave', leave);
          cleanups.push(() => {
            element.removeEventListener('pointerenter', enter);
            element.removeEventListener('pointermove', move);
            element.removeEventListener('pointerleave', leave);
            leave(); element.classList.remove('magnet-returning');
          });
        });

        const hero = document.querySelector<HTMLElement>('.hero');
        const footer = document.querySelector<HTMLElement>('.contact-section');
        let scrollFrame = 0;
        const paintScroll = () => {
          scrollFrame = 0;
          if (hero) {
            const rect = hero.getBoundingClientRect();
            const offset = Math.max(0, Math.min(rect.height * .06, -rect.top * .18));
            hero.style.setProperty('--hero-parallax', `${offset}px`);
            hero.dataset.scrollMotion = 'true';
          }
          if (footer) {
            const rect = footer.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (Math.min(rect.height, innerHeight) * .9)));
            footer.style.setProperty('--footer-curve', `${12 + (1 - progress) * 78}px`);
            footer.style.setProperty('--contact-parallax', `${(1 - progress) * -64}px`);
            footer.dataset.scrollMotion = 'true';
          }
        };
        const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll); };
        paintScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        cleanups.push(() => {
          cancelAnimationFrame(scrollFrame);
          window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll);
          if (hero) { delete hero.dataset.scrollMotion; hero.style.removeProperty('--hero-parallax'); }
          if (footer) { delete footer.dataset.scrollMotion; footer.style.removeProperty('--footer-curve'); footer.style.removeProperty('--contact-parallax'); }
        });
      }
      dispose = () => cleanups.forEach(cleanup => cleanup());
    }

    setup();
    reduced.addEventListener('change', setup);
    finePointer.addEventListener('change', setup);
    return () => {
      dispose();
      reduced.removeEventListener('change', setup);
      finePointer.removeEventListener('change', setup);
    };
  }, [pathname]);

  return null;
}
