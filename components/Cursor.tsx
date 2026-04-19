'use client';

import { useEffect, useRef } from 'react';

const HOVER_SELECTOR =
  'a, button, [role="button"], input, textarea, label, kbd, [data-cursor-lg]';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('cursor-hidden');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { ...target };
    const ringPos = { ...target };
    let raf = 0;
    let visible = false;

    const setVisible = (v: boolean) => {
      if (v === visible) return;
      visible = v;
      dot.style.opacity = v ? '1' : '0';
      ring.style.opacity = v ? '1' : '0';
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: Event) => {
      const t = e.target as Element | null;
      if (t && t.closest(HOVER_SELECTOR)) ring.classList.add('is-hover');
    };
    const onOut = (e: Event) => {
      const t = e.target as Element | null;
      if (t && t.closest(HOVER_SELECTOR)) ring.classList.remove('is-hover');
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');

    const tick = () => {
      dotPos.x += (target.x - dotPos.x) * 0.55;
      dotPos.y += (target.y - dotPos.y) * 0.55;
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('cursor-hidden');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden className="cursor-ring" />
      <div ref={dotRef} aria-hidden className="cursor-dot" />
    </>
  );
}
