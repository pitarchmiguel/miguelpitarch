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
        document.querySelectorAll<HTMLElement>('.circle-button, .project-row').forEach(element => {
          const magnetic = element.classList.contains('circle-button');
          let frame = 0;
          let bounds: DOMRect | undefined;
          const enter = () => { bounds = element.getBoundingClientRect(); };
          const move = (event: PointerEvent) => {
            if (event.pointerType !== 'mouse') return;
            bounds ??= element.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              if (!bounds) return;
              if (magnetic) {
                element.style.setProperty('--magnet-x', `${Math.max(-12, Math.min(12, (x - bounds.width / 2) * .16))}px`);
                element.style.setProperty('--magnet-y', `${Math.max(-12, Math.min(12, (y - bounds.height / 2) * .16))}px`);
              } else {
                element.style.setProperty('--preview-x', `${Math.max(bounds.width * .25, Math.min(bounds.width * .75, x))}px`);
                element.style.setProperty('--preview-y', `${bounds.height / 2 + (y - bounds.height / 2) * .18}px`);
                element.style.setProperty('--preview-angle', `${(x / bounds.width - .5) * 5}deg`);
              }
            });
          };
          const leave = () => {
            cancelAnimationFrame(frame);
            bounds = undefined;
            for (const name of ['--magnet-x', '--magnet-y', '--preview-x', '--preview-y', '--preview-angle']) element.style.removeProperty(name);
          };
          element.addEventListener('pointerenter', enter);
          element.addEventListener('pointermove', move);
          element.addEventListener('pointerleave', leave);
          cleanups.push(() => {
            element.removeEventListener('pointerenter', enter);
            element.removeEventListener('pointermove', move);
            element.removeEventListener('pointerleave', leave);
            leave();
          });
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
