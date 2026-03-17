import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './CSS/CustomCursor.css'

/* ── Total trail count ── */
const TRAIL_COUNT = 20;

export default function CustomCursor() {
  const dotRef      = useRef(null);
  const ringRef     = useRef(null);
  const ring2Ref    = useRef(null);
  const ring3Ref    = useRef(null);
  const chromaRRef  = useRef(null);
  const chromaBRef  = useRef(null);
  const trailRefs   = useRef([]);
  const burstRefs   = useRef([]);
  const labelRef    = useRef(null);

  const mouse       = useRef({ x: -300, y: -300 });
  const prev        = useRef({ x: -300, y: -300 });
  const ring1Pos    = useRef({ x: -300, y: -300 });
  const ring2Pos    = useRef({ x: -300, y: -300 });
  const ring3Pos    = useRef({ x: -300, y: -300 });
  const velocity    = useRef({ x: 0, y: 0 });
  const isHover     = useRef(false);
  const isClick     = useRef(false);
  const rafRef      = useRef(null);
  const frameRef    = useRef(0);

  useEffect(() => {
    document.body.style.cursor = 'none';

    const dot    = dotRef.current;
    const ring   = ringRef.current;
    const ring2  = ring2Ref.current;
    const ring3  = ring3Ref.current;
    const chromaR = chromaRRef.current;
    const chromaB = chromaBRef.current;
    const label  = labelRef.current;
    const trails = trailRefs.current;
    const bursts = burstRefs.current;

    /* ── Continuous ring spin ── */
    gsap.to(ring,  { rotation: 360,  duration: 3,  ease: 'none', repeat: -1 });
    gsap.to(ring2, { rotation: -360, duration: 5,  ease: 'none', repeat: -1 });
    gsap.to(ring3, { rotation: 360,  duration: 9,  ease: 'none', repeat: -1 });

    /* ── RAG loop ── */
    const loop = () => {
      frameRef.current++;
      const { x, y } = mouse.current;

      /* velocity */
      velocity.current.x = x - prev.current.x;
      velocity.current.y = y - prev.current.y;
      const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
      prev.current = { x, y };

      /* dot: instant */
      gsap.set(dot, { x, y });

      /* chromatic aberration offsets based on velocity */
      const cx = velocity.current.x * 1.8;
      const cy = velocity.current.y * 1.8;
      gsap.set(chromaR, { x: x + cx * 1.2, y: y + cy * 1.2 });
      gsap.set(chromaB, { x: x - cx * 0.8, y: y - cy * 0.8 });

      /* squish dot based on speed */
      const squish = Math.min(speed * 0.06, 0.45);
      const angle  = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI);
      if (!isHover.current) {
        gsap.to(dot, {
          scaleX: 1 + squish,
          scaleY: 1 - squish * 0.5,
          rotation: angle,
          duration: 0.12,
          ease: 'power2.out',
        });
      }

      /* ring 1: lag 0.14 */
      ring1Pos.current.x += (x - ring1Pos.current.x) * 0.14;
      ring1Pos.current.y += (y - ring1Pos.current.y) * 0.14;
      gsap.set(ring, { x: ring1Pos.current.x, y: ring1Pos.current.y });

      /* ring 2: lag 0.08 */
      ring2Pos.current.x += (x - ring2Pos.current.x) * 0.08;
      ring2Pos.current.y += (y - ring2Pos.current.y) * 0.08;
      gsap.set(ring2, { x: ring2Pos.current.x, y: ring2Pos.current.y });

      /* ring 3: lag 0.05 (most drag) */
      ring3Pos.current.x += (x - ring3Pos.current.x) * 0.05;
      ring3Pos.current.y += (y - ring3Pos.current.y) * 0.05;
      gsap.set(ring3, { x: ring3Pos.current.x, y: ring3Pos.current.y });

      /* stretch rings based on distance from dot */
      if (!isHover.current) {
        const d1 = Math.sqrt((x - ring1Pos.current.x) ** 2 + (y - ring1Pos.current.y) ** 2);
        const d2 = Math.sqrt((x - ring2Pos.current.x) ** 2 + (y - ring2Pos.current.y) ** 2);
        const stretch1 = 1 + d1 * 0.006;
        const stretch2 = 1 + d2 * 0.004;
        gsap.set(ring,  { scaleX: stretch1, scaleY: 1 / stretch1 });
        gsap.set(ring2, { scaleX: stretch2, scaleY: 1 / stretch2 });
      }

      /* comet trails — emit every 2nd frame */
      if (frameRef.current % 2 === 0 && speed > 0.5) {
        const t = trails[Math.floor(frameRef.current / 2) % TRAIL_COUNT];
        if (t) {
          const size = Math.min(speed * 0.8 + 3, 10);
          gsap.set(t, { x, y, width: size, height: size, opacity: 0.7, scale: 1, borderRadius: '50%' });
          gsap.to(t, { opacity: 0, scale: 0, duration: 0.55, ease: 'power2.out' });
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    /* ── Mouse move ── */
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    /* ── Hover enter ── */
    const onEnter = (e) => {
      isHover.current = true;
      const el = e.currentTarget;
      const text = el.dataset.cursor || '';

      /* dot morphs to cross / disappears */
      gsap.to(dot, { scale: 0, duration: 0.2, ease: 'power3.in' });
      gsap.to(chromaR, { scale: 0, duration: 0.2 });
      gsap.to(chromaB, { scale: 0, duration: 0.2 });

      /* ring 1 expands + fills */
      gsap.to(ring, {
        scale: 2.4,
        borderColor: 'rgba(212,190,228,0.9)',
        backgroundColor: 'rgba(155,126,189,0.1)',
        boxShadow: '0 0 30px rgba(212,190,228,0.5), inset 0 0 20px rgba(155,126,189,0.2)',
        duration: 0.35, ease: 'back.out(1.8)',
      });

      /* ring 2 shrinks and fades */
      gsap.to(ring2, { scale: 0.5, opacity: 0.3, duration: 0.3, ease: 'power2.out' });

      /* ring 3 expands slowly */
      gsap.to(ring3, { scale: 1.6, opacity: 0.5, duration: 0.5, ease: 'power2.out' });

      /* show label if data-cursor set */
      if (text) {
        gsap.set(label, { opacity: 0, scale: 0.7, display: 'flex' });
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' });
        label.textContent = text;
      }

      /* magnetic pull toward element center */
      const rect = el.getBoundingClientRect();
      const elCx = rect.left + rect.width / 2;
      const elCy = rect.top  + rect.height / 2;
      gsap.to(ring, {
        x: elCx, y: elCy,
        duration: 0.5, ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    /* ── Hover leave ── */
    const onLeave = () => {
      isHover.current = false;

      gsap.to(dot, { scale: 1, scaleX: 1, scaleY: 1, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      gsap.to(chromaR, { scale: 1, duration: 0.3 });
      gsap.to(chromaB, { scale: 1, duration: 0.3 });

      gsap.to(ring, {
        scale: 1,
        borderColor: 'rgba(212,190,228,0.55)',
        backgroundColor: 'transparent',
        boxShadow: '0 0 10px rgba(212,190,228,0.2)',
        scaleX: 1, scaleY: 1,
        duration: 0.5, ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
      gsap.to(ring2, { scale: 1, opacity: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      gsap.to(ring3, { scale: 1, opacity: 0.4, duration: 0.5, ease: 'power2.out' });

      gsap.to(label, { opacity: 0, scale: 0.7, duration: 0.2, onComplete: () => {
        label.style.display = 'none';
      }});
    };

    /* ── Click burst ── */
    const onClick = (e) => {
      isClick.current = true;
      const cx = e.clientX;
      const cy = e.clientY;

      /* dot explode */
      gsap.timeline()
        .to(dot, { scale: 4, opacity: 0, duration: 0.18, ease: 'power2.out' })
        .to(dot, { scale: 1, opacity: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });

      /* ring 1 shockwave */
      gsap.timeline()
        .to(ring, { scale: 3.5, opacity: 0, borderColor: 'rgba(232,213,255,1)', duration: 0.4, ease: 'power2.out' })
        .set(ring, { scale: 1, opacity: 1 });

      /* 8 burst particles */
      bursts.forEach((b, i) => {
        if (!b) return;
        const angle = (i / bursts.length) * Math.PI * 2;
        const dist  = 40 + Math.random() * 30;
        const tx    = Math.cos(angle) * dist;
        const ty    = Math.sin(angle) * dist;
        const size  = Math.random() * 5 + 3;

        gsap.set(b, { x: cx, y: cy, opacity: 1, scale: 1, width: size, height: size });
        gsap.to(b, {
          x: cx + tx, y: cy + ty,
          opacity: 0, scale: 0,
          duration: 0.6 + Math.random() * 0.3,
          ease: 'power2.out',
        });
      });

      /* ring 2 ripple */
      gsap.timeline()
        .to(ring2, { scale: 2.8, opacity: 0, duration: 0.5, ease: 'power2.out' })
        .set(ring2, { scale: 1, opacity: 1 });

      isClick.current = false;
    };

    /* ── Attach to interactives ── */
    const attach = () => {
      document.querySelectorAll('a, button, [data-cursor], input, textarea').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();
    /* re-attach on DOM changes */
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('click', onClick);

    /* hide on leave/enter window */
    const onOut = () => gsap.to([dot, ring, ring2, ring3, chromaR, chromaB], { opacity: 0, duration: 0.3 });
    const onIn  = () => gsap.to([dot, ring, ring2, ring3, chromaR, chromaB], { opacity: 1, duration: 0.3 });
    document.addEventListener('mouseleave', onOut);
    document.addEventListener('mouseenter', onIn);

    return () => {
      document.body.style.cursor = '';
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      document.removeEventListener('mouseleave', onOut);
      document.removeEventListener('mouseenter', onIn);
      mo.disconnect();
      document.querySelectorAll('a, button, [data-cursor], input, textarea').forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Comet trail particles */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div key={`trail-${i}`} className="cc-trail" ref={el => trailRefs.current[i] = el}
          style={{ '--i': i }} />
      ))}

      {/* Click burst particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={`burst-${i}`} className="cc-burst" ref={el => burstRefs.current[i] = el}
          style={{ '--bi': i }} />
      ))}

      {/* Outer ghost ring (most lag) */}
      <div className="cc-ring3" ref={ring3Ref} />

      {/* Mid lag ring */}
      <div className="cc-ring2" ref={ring2Ref} />

      {/* Inner spinning ring */}
      <div className="cc-ring" ref={ringRef} />

      {/* Chromatic aberration ghosts */}
      <div className="cc-chroma cc-chroma-r" ref={chromaRRef} />
      <div className="cc-chroma cc-chroma-b" ref={chromaBRef} />

      {/* Core dot */}
      <div className="cc-dot" ref={dotRef} />

      {/* Hover label */}
      <div className="cc-label" ref={labelRef} />
    </>
  );
}