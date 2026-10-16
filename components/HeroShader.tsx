'use client';

import { useEffect, useRef } from 'react';
import { useScroll } from 'motion/react';

// Gold silk behind the hero: domain-warped noise folded into slow ribbons, with
// a soft light that follows the pointer (like the Spotlight tool). three.js is
// loaded after first paint; without WebGL the CSS background is all you see.
// Rendered below device resolution (it's soft anyway), paused off-screen and
// in background tabs, and drawn once when reduced motion is on.

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uFade;
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.035;

  // Warp the field twice so it folds like fabric.
  vec2 q = vec2(fbm(p * 1.1 + vec2(0.0, t)), fbm(p * 1.1 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.5 + 2.0 * q + vec2(1.7, 9.2) + t * 1.3),
                fbm(p * 1.5 + 2.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.3 + 2.4 * r);

  // Light catching the folds: fine contour threads that drift with the
  // warp, over a soft glow where the field is high.
  float thread = pow(1.0 - abs(2.0 * fract(f * 3.2 + r.x * 0.8) - 1.0), 4.5);
  float sheen = smoothstep(0.22, 0.8, f);

  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;
  float spot = exp(-dot(p - m, p - m) * 3.2);

  vec3 deep = vec3(0.62, 0.46, 0.18);
  vec3 gold = vec3(0.96, 0.84, 0.56);
  vec3 col = gold * thread * sheen * (0.42 + 0.7 * spot);
  col += mix(deep, gold, sheen * 0.6) * sheen * (0.035 + 0.12 * spot);
  col += gold * spot * 0.03;

  // Strongest at the top, gone by the bottom edge so it meets the page.
  col *= smoothstep(0.0, 0.55, vUv.y) * smoothstep(1.35, 0.25, length(p * vec2(0.75, 1.0)));
  col *= uFade;
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.012;

  gl_FragColor = vec4(vec3(0.039, 0.039, 0.059) + col, 1.0);
}
`;

export default function HeroShader() {
  const host = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let stop = () => {};
    let cancelled = false;

    (async () => {
      const THREE = await import('three');
      if (cancelled) return;
      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' });
      } catch {
        return; // no WebGL: keep the CSS background
      }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.55;
      renderer.setPixelRatio(scale);
      renderer.domElement.className = 'hero-shader-canvas';
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const uniforms = {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uFade: { value: 1 },
      };
      const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
      const geo = new THREE.PlaneGeometry(2, 2);
      scene.add(new THREE.Mesh(geo, mat));

      const size = { w: 1, h: 1 };
      const resize = () => {
        size.w = el.clientWidth;
        size.h = el.clientHeight;
        renderer.setSize(size.w, size.h, false);
        uniforms.uRes.value.set(size.w * scale, size.h * scale);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // Pointer in shader pixels (origin bottom-left); drifts on its own with no pointer.
      const target = { x: size.w * 0.62, y: size.h * 0.35, moved: false };
      const mouse = { x: target.x, y: target.y };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        target.x = e.clientX - r.left;
        target.y = e.clientY - r.top;
        target.moved = true;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      let visible = true;
      const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
      io.observe(el);

      const fadeUnsub = scrollY.on('change', (y) => {
        uniforms.uFade.value = Math.max(0, 1 - y / (size.h * 0.9));
      });

      const start = performance.now();
      let raf = 0;
      const draw = (now: number) => {
        const t = (now - start) / 1000;
        if (!target.moved) {
          target.x = size.w * (0.5 + 0.22 * Math.sin(t * 0.21));
          target.y = size.h * (0.32 + 0.1 * Math.cos(t * 0.17));
        }
        mouse.x += (target.x - mouse.x) * 0.05;
        mouse.y += (target.y - mouse.y) * 0.05;
        uniforms.uMouse.value.set(mouse.x * scale, (size.h - mouse.y) * scale);
        uniforms.uTime.value = t;
        renderer.render(scene, camera);
      };
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (visible && !document.hidden) draw(now);
      };
      if (reduced) draw(performance.now() + 40000);
      else raf = requestAnimationFrame(loop);
      el.classList.add('is-ready');

      stop = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onMove);
        fadeUnsub();
        ro.disconnect();
        io.disconnect();
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      cancelled = true;
      stop();
    };
  }, [scrollY]);

  return <div ref={host} aria-hidden className="hero-shader pointer-events-none absolute inset-x-0 top-0 -z-20 h-[1100px]" />;
}
