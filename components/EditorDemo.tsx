'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useAnimate, useInView, useReducedMotion, type AnimationOptions, type DOMKeyframesDefinition } from 'motion/react';

// A working-looking Snapmark editor, drawn in HTML at a fixed 960×600 design
// size and scaled to fit, so the animated pointer can use plain coordinates.
// It plays a real annotation session on loop: hide the key, number the steps,
// point an arrow, leave a comment, Copy.

const W = 960;
const H = 600;

// Toolbar order matches the extension's default pill.
const TOOLS = ['select', 'pen', 'arrow', 'rect', 'text', 'comment', 'highlight', 'crop', 'hide', 'number'] as const;
type Tool = (typeof TOOLS)[number];
const TOOL_TOP = 150;
const toolY = (t: Tool) => TOOL_TOP + 25 + TOOLS.indexOf(t) * 34;

const COMMENT = 'Toggle resets after Save';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function EditorDemo() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const inView = useInView(frameRef, { amount: 0.35 });
  const inViewRef = useRef(false);
  const reduced = useReducedMotion();
  const [tool, setTool] = useState<Tool>('comment');
  const [typed, setTyped] = useState(reduced ? COMMENT : '');
  const [toast, setToast] = useState(false);
  const [copyDown, setCopyDown] = useState(false);

  inViewRef.current = inView;

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    let alive = true;
    const go = async (sel: string, to: DOMKeyframesDefinition, opts: AnimationOptions = {}) => {
      if (!alive) return;
      await animate(sel, to, { ease: [0.32, 0.72, 0, 1], ...opts });
    };
    const move = (x: number, y: number, duration = 0.7) => go('.d-pointer', { x, y }, { duration });
    const click = async () => {
      await go('.d-pointer', { scale: 0.82 }, { duration: 0.08 });
      await go('.d-pointer', { scale: 1 }, { duration: 0.14 });
    };
    const waitInView = async () => {
      while (alive && !inViewRef.current) await sleep(300);
    };
    const pick = async (t: Tool) => {
      await move(40, toolY(t), 0.75);
      await click();
      if (alive) setTool(t);
      await sleep(220);
    };

    const run = async () => {
      while (alive) {
        await waitInView();
        // Reset to a clean screenshot.
        setTyped('');
        setToast(false);
        setTool('select');
        await Promise.all([
          go('.d-hide', { width: 0, opacity: 1 }, { duration: 0 }),
          go('.d-arrow-path', { pathLength: 0 }, { duration: 0 }),
          go('.d-arrow-head', { opacity: 0 }, { duration: 0 }),
          go('.d-marker', { scale: 0, opacity: 0 }, { duration: 0 }),
          go('.d-bubble', { scale: 0.6, opacity: 0 }, { duration: 0 }),
          go('.d-annot', { opacity: 1 }, { duration: 0 }),
          go('.d-pointer', { x: 520, y: 560, opacity: 1 }, { duration: 0 }),
        ]);
        await sleep(700);

        // 1. Hide the secret key.
        await pick('hide');
        await move(290, 212, 0.8);
        await go('.d-pointer', { scale: 0.88 }, { duration: 0.08 });
        await Promise.all([
          move(682, 254, 0.9),
          go('.d-hide', { width: 392 }, { duration: 0.9, ease: [0.32, 0.72, 0, 1] }),
        ]);
        await go('.d-pointer', { scale: 1 }, { duration: 0.12 });
        await sleep(350);

        // 2. Number the steps.
        await pick('number');
        await move(712, 284);
        await click();
        await go('.d-marker-1', { scale: 1, opacity: 1 }, { type: 'spring', stiffness: 520, damping: 18 });
        await move(812, 392, 0.6);
        await click();
        await go('.d-marker-2', { scale: 1, opacity: 1 }, { type: 'spring', stiffness: 520, damping: 18 });
        await sleep(300);

        // 3. Point at the toggle.
        await pick('arrow');
        await move(468, 296, 0.8);
        await go('.d-pointer', { scale: 0.88 }, { duration: 0.08 });
        await Promise.all([
          move(640, 291, 0.7),
          go('.d-arrow-path', { pathLength: 1 }, { duration: 0.7, ease: [0.32, 0.72, 0, 1] }),
        ]);
        await go('.d-arrow-head', { opacity: 1 }, { duration: 0.12 });
        await go('.d-pointer', { scale: 1 }, { duration: 0.12 });
        await sleep(300);

        // 4. Leave a comment.
        await pick('comment');
        await move(690, 458, 0.8);
        await click();
        await go('.d-bubble', { scale: 1, opacity: 1 }, { type: 'spring', stiffness: 420, damping: 22 });
        for (let i = 1; i <= COMMENT.length && alive; i++) {
          setTyped(COMMENT.slice(0, i));
          await sleep(38 + Math.random() * 40);
        }
        await sleep(600);

        // 5. Copy.
        await move(854, 32, 0.9);
        await go('.d-pointer', { scale: 0.82 }, { duration: 0.08 });
        if (alive) setCopyDown(true);
        await sleep(140);
        if (alive) { setCopyDown(false); setToast(true); }
        await go('.d-pointer', { scale: 1 }, { duration: 0.14 });
        await move(600, 140, 1.2);
        await sleep(2600);

        // Fade out and go again.
        await Promise.all([
          go('.d-annot', { opacity: 0 }, { duration: 0.6 }),
          go('.d-pointer', { opacity: 0 }, { duration: 0.6 }),
        ]);
        setToast(false);
        await sleep(500);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [animate, reduced]);

  return (
    <div ref={frameRef} className="relative w-full" style={{ height: H * scale }}>
      <div
        ref={scope}
        className="demo-stage absolute left-0 top-0 origin-top-left overflow-hidden"
        style={{ width: W, height: H, transform: `scale(${scale})` }}
        aria-label="Snapmark annotating a screenshot: hiding a secret key, numbering steps, adding an arrow and a comment, then copying"
        role="img"
      >
        {/* The screenshot being annotated */}
        <MockApp />

        {/* Annotations, in stage coordinates */}
        <div className="d-annot pointer-events-none absolute inset-0">
          <div
            className="d-hide absolute rounded-[3px] bg-[#111]"
            style={{ left: 290, top: 212, height: 40, width: reduced ? 392 : 0 }}
          />
          <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
            <motion.path
              className="d-arrow-path"
              d="M468 296 L640 291"
              stroke="#007aff"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: reduced ? 1 : 0 }}
            />
            <path
              className="d-arrow-head"
              d="M624 283 L640 291 L624.4 300"
              stroke="#007aff"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: reduced ? 1 : 0 }}
            />
          </svg>
          <Marker className="d-marker-1" x={712} y={284} n={1} reduced={!!reduced} />
          <Marker className="d-marker-2" x={812} y={392} n={2} reduced={!!reduced} />
          <div
            className="d-bubble demo-bubble absolute origin-top-right"
            style={{ right: W - 690, top: 458, opacity: reduced ? 1 : 0 }}
          >
            {typed || <span className="opacity-55">Comment</span>}
            {!reduced && typed && typed.length < COMMENT.length ? <span className="demo-caret" /> : null}
          </div>
        </div>

        <Chrome tool={tool} copyDown={copyDown} />

        <div className={`demo-toast ${toast ? 'is-on' : ''}`} aria-hidden>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          Copied. <kbd>⌘V</kbd> to paste into your chat
        </div>

        {!reduced && (
          <motion.svg className="d-pointer absolute left-0 top-0" width="26" height="30" viewBox="0 0 26 30" initial={{ x: 520, y: 560 }}>
            <path d="M3 2 L3 24 L9 18.5 L13 27 L17 25.2 L13 17 L21 17 Z" fill="#fff" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
          </motion.svg>
        )}
      </div>
    </div>
  );
}

function Marker({ x, y, n, className, reduced }: { x: number; y: number; n: number; className: string; reduced: boolean }) {
  return (
    <motion.div
      className={`d-marker ${className} demo-marker absolute`}
      style={{ left: x - 17, top: y - 17 }}
      initial={{ scale: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
    >
      {n}
    </motion.div>
  );
}

const ICON: Record<Tool, React.ReactNode> = {
  select: <path d="M5 3l6.5 15.5 2.3-6.8 6.7-2.3z" />,
  pen: <><path d="M16 4a2.6 2.6 0 1 1 3.7 3.7L8 19.4 3 21l1.6-5z" /></>,
  arrow: <><path d="M6 18 18 6" /><path d="M9 6h9v9" /></>,
  rect: <rect x="4" y="6" width="16" height="12" rx="2.5" />,
  text: <><path d="M5 7V5h14v2" /><path d="M12 5v14" /><path d="M9 19h6" /></>,
  comment: <path d="M5 19v-7a7 7 0 1 1 7 7z" />,
  highlight: <><path d="M9 11l-5 5v3h3l5-5" /><path d="M20 11.5 16 15.5a2 2 0 0 1-2.8 0L9 11.2l5.3-5.3 5.7 5.7z" /></>,
  crop: <><path d="M6 3v13a2 2 0 0 0 2 2h13" /><path d="M18 21V8a2 2 0 0 0-2-2H3" /></>,
  hide: <rect x="4" y="7" width="16" height="10" rx="2" fill="currentColor" stroke="none" />,
  number: <><circle cx="12" cy="12" r="8.5" /><path d="M11 9.5l1.6-1.2V16" /></>,
};

function Chrome({ tool, copyDown }: { tool: Tool; copyDown: boolean }) {
  return (
    <>
      {/* Tool pill */}
      <div className="demo-glass absolute flex flex-col items-center gap-0 rounded-[24px] p-[5px]" style={{ left: 18, top: TOOL_TOP }}>
        <span className="mb-1 grid h-4 w-8 place-items-center text-[#f5f5f7]/50">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="2" /><circle cx="16" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="8" cy="18" r="2" /><circle cx="16" cy="18" r="2" /></svg>
        </span>
        {TOOLS.map((t) => (
          <span key={t} className={`demo-tool ${tool === t ? 'is-on' : ''}`}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {ICON[t]}
            </svg>
          </span>
        ))}
      </div>

      {/* Upload / Copy / Close */}
      <div className="absolute flex gap-[6px]" style={{ right: 18, top: 14 }}>
        <span className="demo-glass demo-btn">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 15V3" /><path d="m7 8 5-5 5 5" /><path d="M20 15v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" /></svg>
          Upload
        </span>
        <span className={`demo-gold demo-btn ${copyDown ? 'is-down' : ''}`}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="9" y="9" width="12" height="12" rx="2.5" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          Copy
        </span>
        <span className="demo-glass demo-btn !w-[34px] !px-0">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </span>
      </div>

      {/* Style bar */}
      <div className="demo-glass absolute flex items-center gap-[3px] rounded-[24px] px-[8px] py-[5px]" style={{ left: '50%', bottom: 16, transform: 'translateX(-50%)' }}>
        {[4, 7, 10].map((s, i) => (
          <span key={s} className={`demo-tool !h-[30px] !w-[30px] ${i === 1 ? 'is-on' : ''}`}>
            <span className="rounded-full bg-[#f5f5f7]" style={{ width: s, height: s }} />
          </span>
        ))}
        <span className="mx-[6px] h-5 w-px bg-white/20" />
        {['#ff3b30', '#ff9500', '#34c759', '#007aff', '#af52de', '#ffffff', '#000000'].map((c) => (
          <span key={c} className={`demo-swatch ${c === '#007aff' ? 'is-on' : ''}`} style={{ background: c }} />
        ))}
        <span className="mx-[6px] h-5 w-px bg-white/20" />
        <span className="demo-tool !h-[30px] !w-[30px] opacity-80">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>
        </span>
        <span className="demo-tool !h-[30px] !w-[30px] opacity-40">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 14 5-5-5-5" /><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" /></svg>
        </span>
      </div>
    </>
  );
}

// The "screenshot": a light-mode settings page, at stage offset (96, 64).
function MockApp() {
  return (
    <div className="mock-app absolute overflow-hidden rounded-[12px]" style={{ left: 96, top: 64, width: 760, height: 440 }}>
      <div className="flex h-[44px] items-center gap-3 border-b border-black/[0.07] bg-white px-5">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-[#4f46e5] text-[11px] font-bold text-white">A</span>
        <span className="text-[13px] font-semibold text-[#111827]">Acme Console</span>
        <span className="text-[12px] text-[#9ca3af]">/ Settings / API &amp; Webhooks</span>
        <span className="ml-auto h-6 w-6 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f97316]" />
      </div>
      <div className="flex h-[396px]">
        <div className="w-[150px] border-r border-black/[0.06] bg-[#f9fafb] px-3 py-4 text-[12px] text-[#6b7280]">
          {['Overview', 'Projects', 'Deploys', 'API & Webhooks', 'Billing', 'Team'].map((n) => (
            <div key={n} className={`mb-1 rounded-md px-2 py-[6px] ${n === 'API & Webhooks' ? 'bg-[#eef2ff] font-semibold text-[#4338ca]' : ''}`}>
              {n}
            </div>
          ))}
        </div>
        <div className="relative flex-1 bg-white">
          <div className="absolute" style={{ left: 30, top: 18 }}>
            <div className="text-[18px] font-semibold tracking-tight text-[#111827]">API &amp; Webhooks</div>
            <div className="mt-0.5 text-[12px] text-[#6b7280]">Keys and delivery settings for production.</div>
          </div>
          <div className="absolute rounded-[10px] border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ left: 30, top: 72, width: 540, height: 262 }}>
            <div className="absolute text-[11px] font-medium text-[#374151]" style={{ left: 20, top: 16 }}>Secret key</div>
            <div className="absolute flex items-center rounded-[7px] border border-black/[0.1] bg-[#f9fafb] px-3 font-mono text-[12.5px] text-[#111827]" style={{ left: 20, top: 34, width: 380, height: 36 }}>
              acme_live_demo_key_not_real_Z3kE
            </div>
            <div className="absolute text-[12.5px] text-[#111827]" style={{ left: 20, top: 104 }}>Send webhooks on deploy</div>
            <div className="absolute rounded-full bg-[#4f46e5]" style={{ left: 372, top: 100, width: 40, height: 22 }}>
              <span className="absolute right-[3px] top-[3px] h-4 w-4 rounded-full bg-white shadow" />
            </div>
            <div className="absolute text-[11px] font-medium text-[#374151]" style={{ left: 20, top: 140 }}>Endpoint URL</div>
            <div className="absolute flex items-center rounded-[7px] border border-black/[0.1] px-3 text-[12.5px] text-[#374151]" style={{ left: 20, top: 158, width: 380, height: 36 }}>
              https://api.acme.dev/hooks/deploy
            </div>
            <div className="absolute grid place-items-center rounded-[7px] border border-black/[0.12] text-[12px] font-medium text-[#374151]" style={{ left: 330, top: 212, width: 80, height: 34 }}>Cancel</div>
            <div className="absolute grid place-items-center rounded-[7px] bg-[#4f46e5] text-[12px] font-semibold text-white" style={{ left: 420, top: 212, width: 104, height: 34 }}>Save changes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
