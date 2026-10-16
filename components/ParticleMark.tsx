'use client';

import { useEffect, useRef } from 'react';
import { useScroll, useSpring } from 'motion/react';

// The Snapmark mark (four corner brackets and an arrow) made of gold
// particles. They drift as a loose cloud and assemble as the section scrolls
// into view (scroll progress → a Motion spring → a shader uniform); the
// pointer pushes them aside. three.js loads lazily; without WebGL the section
// simply has no mark.

const VERT = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform vec2 uMouse;
uniform float uHover;
uniform float uPixel;
attribute vec3 aStart;
attribute float aSeed;
varying float vSeed;
varying float vGlow;

void main() {
  // Each particle arrives a little after the last, so the mark draws itself in.
  float p = clamp((uProgress - aSeed * 0.35) / 0.65, 0.0, 1.0);
  p = p * p * (3.0 - 2.0 * p);
  vec3 pos = mix(aStart, position, p);

  // A slow swirl while loose, a faint shimmer once settled.
  float w = uTime * 0.6 + aSeed * 6.2831;
  pos += vec3(sin(w), cos(w * 1.3), sin(w * 0.7)) * mix(0.18, 0.012, p);

  // Push away from the pointer.
  vec2 d = pos.xy - uMouse;
  float k = exp(-dot(d, d) * 9.0) * uHover;
  pos.xy += normalize(d + 1e-4) * k * 0.28;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (2.2 + aSeed * 2.6) * uPixel * (3.2 / -mv.z);
  vSeed = aSeed;
  vGlow = k;
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
varying float vSeed;
varying float vGlow;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  vec3 deep = vec3(0.86, 0.66, 0.30);
  vec3 cream = vec3(1.0, 0.95, 0.82);
  vec3 col = mix(deep, cream, vSeed) + vGlow * 0.4;
  float twinkle = 0.7 + 0.3 * sin(uTime * 2.0 + vSeed * 40.0);
  gl_FragColor = vec4(col, a * twinkle * 0.9);
}
`;

// Points on the mark, centred on (0, 0), about 2 units across.
function sampleMark(): Float32Array {
  const S = 220;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d')!;
  g.strokeStyle = '#fff';
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.lineWidth = 14;
  const m = 26, len = 48, R = 18;
  // Corner brackets.
  const corner = (x: number, y: number, sx: number, sy: number) => {
    g.beginPath();
    g.moveTo(x, y + sy * len);
    g.lineTo(x, y + sy * R);
    g.quadraticCurveTo(x, y, x + sx * R, y);
    g.lineTo(x + sx * len, y);
    g.stroke();
  };
  corner(m, m, 1, 1);
  corner(S - m, m, -1, 1);
  corner(m, S - m, 1, -1);
  corner(S - m, S - m, -1, -1);
  // The arrow, bottom-left to top-right.
  g.beginPath();
  g.moveTo(74, 146);
  g.lineTo(146, 74);
  g.moveTo(102, 74);
  g.lineTo(146, 74);
  g.lineTo(146, 118);
  g.stroke();

  const data = g.getImageData(0, 0, S, S).data;
  const pts: number[] = [];
  for (let y = 0; y < S; y += 3) {
    for (let x = 0; x < S; x += 3) {
      if (data[(y * S + x) * 4 + 3] > 128) {
        pts.push((x / S - 0.5) * 2.2 + (Math.random() - 0.5) * 0.012, -(y / S - 0.5) * 2.2, (Math.random() - 0.5) * 0.06);
      }
    }
  }
  return new Float32Array(pts);
}

export default function ParticleMark() {
  const host = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: host, offset: ['start end', 'center center'] });
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

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
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      } catch {
        return;
      }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
      camera.position.z = 5.2;

      const target = sampleMark();
      const n = target.length / 3;
      const start = new Float32Array(n * 3);
      const seed = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        // A loose shell around the mark.
        const u = Math.random() * Math.PI * 2;
        const v = Math.acos(2 * Math.random() - 1);
        const r = 1.8 + Math.random() * 1.6;
        start[i * 3] = r * Math.sin(v) * Math.cos(u) * 1.4;
        start[i * 3 + 1] = r * Math.sin(v) * Math.sin(u) * 0.8;
        start[i * 3 + 2] = r * Math.cos(v);
        seed[i] = Math.random();
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(target, 3));
      geo.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
      geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

      const uniforms = {
        uTime: { value: 0 },
        uProgress: { value: reduced ? 1 : progress.get() },
        uMouse: { value: new THREE.Vector2(9, 9) },
        uHover: { value: 0 },
        uPixel: { value: dpr },
      };
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // Pointer in the mark's plane (z = 0).
      const hover = { on: false, x: 9, y: 9 };
      const tilt = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
        const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        hover.x = nx * halfH * camera.aspect;
        hover.y = ny * halfH;
        hover.on = Math.abs(nx) < 1.1 && Math.abs(ny) < 1.1;
        tilt.x = ny * 0.18;
        tilt.y = nx * 0.28;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      let visible = false;
      const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
      io.observe(el);
      const unsub = progress.on('change', (v) => { if (!reduced) uniforms.uProgress.value = v; });

      const t0 = performance.now();
      let raf = 0;
      const draw = (now: number) => {
        const t = (now - t0) / 1000;
        uniforms.uTime.value = t;
        uniforms.uHover.value += ((hover.on ? 1 : 0) - uniforms.uHover.value) * 0.08;
        uniforms.uMouse.value.x += (hover.x - uniforms.uMouse.value.x) * 0.2;
        uniforms.uMouse.value.y += (hover.y - uniforms.uMouse.value.y) * 0.2;
        points.rotation.x += (tilt.x - points.rotation.x) * 0.05;
        points.rotation.y += (tilt.y + Math.sin(t * 0.4) * 0.12 - points.rotation.y) * 0.05;
        renderer.render(scene, camera);
      };
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (visible && !document.hidden) draw(now);
      };
      if (reduced) draw(performance.now());
      else raf = requestAnimationFrame(loop);

      stop = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onMove);
        unsub();
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
  }, [progress]);

  return <div ref={host} aria-hidden className="particle-mark mx-auto h-[300px] w-full max-w-xl sm:h-[360px]" />;
}
