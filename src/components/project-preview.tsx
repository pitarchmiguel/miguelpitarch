'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { projects } from '@/lib/projects';

/** Viewport-level preview: image and cursor settle at different speeds. */
export function ProjectPreview() {
  const image = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 721px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let dispose = () => {};
    function setup() {
      dispose();
      const picture = image.current, badge = cursor.current, slides = strip.current;
      const list = document.querySelector<HTMLElement>('.work-list');
      if (!media.matches || !picture || !badge || !slides || !list) { dispose = () => {}; return; }
      list.classList.add('has-floating-preview');
      let active = -1, frame = 0, lastTime = 0;
      let targetX = 0, targetY = 0, imageX = 0, imageY = 0, cursorX = 0, cursorY = 0;
      let positioned = false, pointerInput = true;
      const position = () => {
        picture.style.transform = `translate3d(${imageX}px, ${imageY}px, 0)`;
        badge.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      };
      const tick = (time: number) => {
        const dt = Math.min(time - (lastTime || time - 16), 50);
        lastTime = time;
        const imageEase = 1 - Math.exp(-dt / 100), cursorEase = 1 - Math.exp(-dt / 48);
        imageX += (targetX - imageX) * imageEase; imageY += (targetY - imageY) * imageEase;
        cursorX += (targetX - cursorX) * cursorEase; cursorY += (targetY - cursorY) * cursorEase;
        position();
        if (Math.abs(targetX - imageX) + Math.abs(targetY - imageY) > .1) frame = requestAnimationFrame(tick);
        else { frame = 0; lastTime = 0; }
      };
      const hide = () => {
        active = -1;
        picture.classList.remove('is-active'); badge.classList.remove('is-active', 'is-pressed');
      };
      const select = (element: Element | null) => {
        const row = element?.closest<HTMLElement>('.project-row');
        const index = Number(row?.dataset.projectIndex);
        if (!row || !list.contains(row) || !Number.isInteger(index) || index < 0 || index >= projects.length) { hide(); return; }
        if (active !== index) {
          active = index;
          slides.style.transform = `translateY(-${index * 100}%)`;
          picture.dataset.project = projects[index].slug;
        }
        picture.classList.add('is-active'); badge.classList.add('is-active');
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        pointerInput = true;
        targetX = event.clientX; targetY = event.clientY;
        if (!positioned) { imageX = cursorX = targetX; imageY = cursorY = targetY; positioned = true; position(); }
        const wasActive = active >= 0;
        select(event.target instanceof Element ? event.target : null);
        if (!wasActive && active >= 0) {
          imageX = cursorX = targetX; imageY = cursorY = targetY; position();
        }
        if (!frame && active >= 0) frame = requestAnimationFrame(tick);
      };
      const scroll = () => { if (positioned && pointerInput) select(document.elementFromPoint(targetX, targetY)); };
      const keyboard = (event: KeyboardEvent) => { if (event.key === 'Tab') { pointerInput = false; hide(); } };
      const press = () => { if (active >= 0) badge.classList.add('is-pressed'); };
      const release = () => badge.classList.remove('is-pressed');
      document.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerleave', hide);
      document.addEventListener('keydown', keyboard);
      document.addEventListener('pointerdown', press);
      document.addEventListener('pointerup', release);
      window.addEventListener('scroll', scroll, { passive: true });
      window.addEventListener('blur', hide);
      dispose = () => {
        cancelAnimationFrame(frame); hide(); list.classList.remove('has-floating-preview');
        document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', hide);
        document.removeEventListener('keydown', keyboard); document.removeEventListener('pointerdown', press); document.removeEventListener('pointerup', release);
        window.removeEventListener('scroll', scroll); window.removeEventListener('blur', hide);
        picture.style.removeProperty('transform'); badge.style.removeProperty('transform');
      };
    }
    setup(); media.addEventListener('change', setup);
    return () => { dispose(); media.removeEventListener('change', setup); };
  }, []);

  return <div aria-hidden="true" className="preview-layer">
    <div ref={image} className="floating-project-image"><div className="preview-window"><div ref={strip} className="preview-strip">{projects.map(project => <div key={project.slug} className="preview-slide" style={{ backgroundColor: project.background }}><Image src={project.image} alt="" width={1024} height={1024} sizes="28vw"/></div>)}</div></div></div>
    <div ref={cursor} className="floating-project-cursor"><span>Ver</span></div>
  </div>;
}
