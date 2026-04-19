'use client';

import { useEffect, useRef } from 'react';

const IDLE_MS = 1500;

export default function AmbientGlow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const blob = blobRef.current;
    if (!wrap || !blob) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let raf = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const armIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => blob.classList.add('is-idle'), IDLE_MS);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      blob.classList.remove('is-idle');
      armIdle();
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.035;
      current.y += (target.y - current.y) * 0.035;
      wrap.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    armIdle();
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="ambient-glow-wrapper">
      <div ref={blobRef} className="ambient-glow" />
    </div>
  );
}
