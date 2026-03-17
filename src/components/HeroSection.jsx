import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import prof from '../assets/images/Gemini_Generated_Image_7jmqz27jmqz27jmq-removebg-preview.png';
import './CSS/HeroSection.css';

const SYMBOLS = [
  '{ }', '/>', '=>', 'async', 'await', 'def',
  'import', 'return', 'const', '[ ]', '&&',
  'git', 'npm', 'API', '( )', '#!', 'px',
  '01', '10', '</>',
];

export default function HeroSection() {
  const sectionRef    = useRef(null);
  const canvasRef     = useRef(null);
  const rightRef      = useRef(null);
  const figureWrapRef = useRef(null);

  const imgMainRef    = useRef(null);
  const imgRedRef     = useRef(null);
  const imgBlueRef    = useRef(null);

  const auraRef       = useRef(null);
  const floorRef      = useRef(null);
  const ringOuterRef  = useRef(null);
  const ringInnerRef  = useRef(null);
  const figScanRef    = useRef(null);
  const vignetteRef   = useRef(null);
  const statusRef     = useRef(null);
  const nameRef       = useRef(null);
  const labelRef      = useRef(null);
  const roleRef       = useRef(null);
  const bioRef        = useRef(null);
  const actionsRef    = useRef(null);
  const lightRaysRef  = useRef([]);
  const orbsRef       = useRef([]);

  /* ── Canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let mouse = { x: -999, y: -999 };
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const onMouse = (e) => { const r = canvas.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; };
    window.addEventListener('mousemove', onMouse);

    const pts = Array.from({ length: 65 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.4, base: Math.random() * 0.45 + 0.2,
    }));
    const stars = Array.from({ length: 6 }, () => ({
      x: 0, y: 0, len: Math.random() * 130 + 60, speed: Math.random() * 4 + 3,
      opacity: 0, active: false, timer: Math.random() * 200,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.timer--;
        if (s.timer <= 0 && !s.active) { s.active = true; s.x = Math.random() * canvas.width * 0.6; s.y = Math.random() * canvas.height * 0.4; s.opacity = 0.9; s.timer = Math.random() * 300 + 200; }
        if (s.active) {
          s.x += s.speed * 1.4; s.y += s.speed * 0.5; s.opacity -= 0.014;
          if (s.opacity <= 0) s.active = false;
          const g = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.35);
          g.addColorStop(0, `rgba(232,213,255,${s.opacity})`); g.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.len, s.y - s.len * 0.35);
          ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2); ctx.fillStyle = `rgba(232,213,255,${s.opacity})`; ctx.fill();
        }
      });
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy), lit = d < 110;
        if (lit) { p.vx += dx / d * 0.04; p.vy += dy / d * 0.04; }
        ctx.beginPath(); ctx.arc(p.x, p.y, lit ? p.r * 1.7 : p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,190,228,${lit ? Math.min(1, p.base + (1 - d / 110) * 0.6) : p.base})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 115) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(155,126,189,${0.26 * (1 - d / 115)})`; ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouse); };
  }, []);

  /* ── GSAP: figure scene animations ── */
  useEffect(() => {
    const imgMain  = imgMainRef.current;
    const imgRed   = imgRedRef.current;
    const imgBlue  = imgBlueRef.current;
    const aura     = auraRef.current;
    const floor    = floorRef.current;
    const ro       = ringOuterRef.current;
    const ri       = ringInnerRef.current;
    const scan     = figScanRef.current;
    const status   = statusRef.current;
    if (!imgMain) return;

    // ── 1. ENTRANCE: clip-path wipe upward ──
    gsap.set(imgMain,  { clipPath: 'inset(100% 0% 0% 0%)', opacity: 1 });
    gsap.set([imgRed, imgBlue], { opacity: 0 });

    gsap.to(imgMain, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut', delay: 0.2 });

    // Chromatic flash on entrance
    gsap.to(imgRed,  { opacity: 0.3, duration: 0.25, delay: 0.6, yoyo: true, repeat: 1 });
    gsap.to(imgBlue, { opacity: 0.25, duration: 0.25, delay: 0.72, yoyo: true, repeat: 1 });

    // ── 2. Continuous float — whole wrap ──
    gsap.to(figureWrapRef.current, { y: -16, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 });

    // ── 3. BOX-SHADOW glow pulse on main image ──
    // Builds from nothing → rich purple corona → breathes
    gsap.fromTo(imgMain,
      { filter: 'brightness(1) drop-shadow(0 0 0px transparent)' },
      {
        filter: 'brightness(1.06) drop-shadow(0 0 28px rgba(155,100,210,0.55)) drop-shadow(0 0 60px rgba(100,50,180,0.28))',
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.6,
      }
    );

    // ── 4. Secondary edge-glow — cool rim light that syncs opposite phase ──
    gsap.to(imgMain, {
      keyframes: [
        { filter: 'brightness(1.06) drop-shadow(0 0 28px rgba(155,100,210,0.55)) drop-shadow(0 0 60px rgba(100,50,180,0.28)) drop-shadow(-8px 0 18px rgba(180,130,240,0.3))', duration: 3 },
        { filter: 'brightness(1.02) drop-shadow(0 0 12px rgba(155,100,210,0.3))  drop-shadow(0 0 30px rgba(80, 30,160,0.18)) drop-shadow( 8px 0 18px rgba(120, 80,200,0.25))', duration: 3 },
      ],
      repeat: -1,
      yoyo: false,
      delay: 2,
    });

    // ── 5. Figure-level scanline sweep ──
    if (scan) {
      const runScan = () => {
        gsap.fromTo(scan,
          { top: '100%', opacity: 0 },
          {
            top: '0%', opacity: 1, duration: 0.05, ease: 'none',
            onComplete: () => {
              gsap.to(scan, {
                top: '-4px', opacity: 0, duration: 2.0, ease: 'power2.in',
                onComplete: () => setTimeout(runScan, Math.random() * 4500 + 3000),
              });
            },
          }
        );
      };
      setTimeout(runScan, 3200);
    }

    // ── 6. Aura bloom + breathe ──
    if (aura) {
      gsap.fromTo(aura, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.5, ease: 'power2.out', delay: 0.4 });
      gsap.to(aura, { scale: 1.12, opacity: 0.85, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3 });
    }

    // ── 7. Floor glow ──
    if (floor) gsap.fromTo(floor, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 1.3 });

    // ── 8. Rings spin ──
    if (ro) {
      gsap.fromTo(ro, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: 'power2.out', delay: 0.5 });
      gsap.to(ro, { rotate: 360, duration: 28, ease: 'none', repeat: -1 });
    }
    if (ri) {
      gsap.fromTo(ri, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: 'power2.out', delay: 0.65 });
      gsap.to(ri, { rotate: -360, duration: 17, ease: 'none', repeat: -1 });
    }

    // ── 9. Light rays stagger ──
    lightRaysRef.current.forEach((ray, i) => {
      if (!ray) return;
      gsap.fromTo(ray, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.9 + i * 0.08 });
      gsap.to(ray, { opacity: 0.04, duration: 2.6 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.5 + i * 0.2 });
    });

    // ── 10. Orbs drift ──
    orbsRef.current.forEach((orb, i) => {
      if (!orb) return;
      gsap.fromTo(orb, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2.2)', delay: 1.4 + i * 0.14 });
      gsap.to(orb, { y: `+=${20 + i * 5}`, x: `+=${(i % 2 === 0 ? -1 : 1) * 10}`, duration: 2.8 + i * 0.45, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.25 });
    });

    // ── 11. Status badge ──
    if (status) gsap.fromTo(status, { scale: 0, opacity: 0, x: 20 }, { scale: 1, opacity: 1, x: 0, duration: 0.65, ease: 'back.out(2.5)', delay: 1.9 });

  }, []);

  /* ── GSAP: Glitch shock — chromatic burst only, no position shift ── */
  useEffect(() => {
    const imgMain = imgMainRef.current;
    const imgRed  = imgRedRef.current;
    const imgBlue = imgBlueRef.current;
    if (!imgMain) return;

    let gt;
    const glitch = () => {
      const tl = gsap.timeline({
        onComplete: () => { gt = setTimeout(glitch, Math.random() * 5500 + 3500); }
      });

      // Phase 1: hard chromatic split + brightness spike
      tl.to(imgRed,  { x: -8, opacity: 0.55, duration: 0.055, ease: 'none' }, 0)
        .to(imgBlue, { x:  8, opacity: 0.50, duration: 0.055, ease: 'none' }, 0)
        .to(imgMain, { filter: 'brightness(1.5) saturate(1.4) drop-shadow(0 0 40px rgba(200,150,255,0.9)) drop-shadow(0 0 80px rgba(140,80,220,0.6))', duration: 0.055 }, 0)

      // Phase 2: secondary flicker
        .to(imgRed,  { x: -5, opacity: 0.35, duration: 0.045 })
        .to(imgBlue, { x:  5, opacity: 0.30, duration: 0.045, }, '<')
        .to(imgMain, { filter: 'brightness(0.85) drop-shadow(0 0 8px rgba(155,100,210,0.4))', duration: 0.04 })

      // Phase 3: snap back with residual glow
        .to([imgRed, imgBlue], { x: 0, opacity: 0, duration: 0.07 })
        .to(imgMain, {
          filter: 'brightness(1.06) drop-shadow(0 0 28px rgba(155,100,210,0.55)) drop-shadow(0 0 60px rgba(100,50,180,0.28))',
          duration: 0.12,
          ease: 'power2.out',
        });
    };

    gt = setTimeout(glitch, 4000);
    return () => clearTimeout(gt);
  }, []);

  /* ── Text stagger ── */
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.9 });
    tl.fromTo(labelRef.current,   { x: -40, opacity: 0 },           { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
      .fromTo(nameRef.current,    { y: 50, opacity: 0, skewY: 4 },  { y: 0, opacity: 1, skewY: 0, duration: 0.9, ease: 'power4.out' }, '-=0.3')
      .fromTo(roleRef.current,    { x: 30, opacity: 0 },            { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo(bioRef.current,     { y: 20, opacity: 0 },            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .fromTo(actionsRef.current, { y: 20, opacity: 0 },            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2');
  }, []);

  /* ── Floating symbols ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const nodes = SYMBOLS.map((text, i) => {
      const el = document.createElement('span');
      el.className = 'hero-symbol'; el.textContent = text;
      const left = i % 2 === 0;
      el.style.left = `${left ? Math.random() * 17 + 1 : Math.random() * 17 + 80}%`;
      el.style.top  = `${Math.random() * 76 + 10}%`;
      el.style.opacity = '0';
      section.appendChild(el);
      return el;
    });
    gsap.to(nodes, { opacity: 0.5, scale: 1, duration: 0.7, ease: 'power2.out', stagger: { each: 0.06, from: 'random' }, delay: 1.8 });
    nodes.forEach(n => gsap.to(n, { y: `+=${Math.random() * 28 - 14}`, x: `+=${Math.random() * 18 - 9}`, rotation: Math.random() * 8 - 4, duration: Math.random() * 4 + 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: Math.random() * 2 }));
    let ft;
    const flicker = () => {
      const el = nodes[Math.floor(Math.random() * nodes.length)];
      gsap.timeline()
        .to(el, { opacity: 1, color: '#E8D5FF', scale: 1.35, textShadow: '0 0 20px rgba(232,213,255,0.9)', duration: 0.12 })
        .to(el, { opacity: 0.45, color: '#9B7EBD', scale: 1, textShadow: '0 0 10px rgba(155,126,189,0.5)', duration: 0.4, ease: 'power2.out' });
      ft = setTimeout(flicker, Math.random() * 900 + 400);
    };
    ft = setTimeout(flicker, 2400);
    const onMove = (e) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      nodes.forEach((n, i) => gsap.to(n, { x: (e.clientX - cx) * ((i % 3 + 1) * 0.005), y: (e.clientY - cy) * ((i % 3 + 1) * 0.005), duration: 1.4, ease: 'power1.out', overwrite: 'auto' }));
    };
    window.addEventListener('mousemove', onMove);
    return () => { clearTimeout(ft); window.removeEventListener('mousemove', onMove); nodes.forEach(n => n.remove()); };
  }, []);

  /* ── Page scanline ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scan = document.createElement('div');
    scan.className = 'hero-scanline';
    section.appendChild(scan);
    gsap.to(scan, { y: '100vh', duration: 6, ease: 'none', repeat: -1, delay: 2 });
    return () => scan.remove();
  }, []);

  const rayAngles    = [-42, -26, -13, 0, 13, 26, 42];
  const orbPositions = [
    { top: '16%', left: '16%'  },
    { top: '70%', left: '10%'  },
    { top: '20%', right: '8%'  },
    { top: '62%', right: '14%' },
    { top: '44%', left: '3%'   },
  ];

  return (
    <section className="hero-section" ref={sectionRef}>
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-bg-glow glow-top" />
      <div className="hero-bg-glow glow-bottom" />
      <div className="hero-corner hero-corner-tl"><span /><span /></div>
      <div className="hero-corner hero-corner-br"><span /><span /></div>

      <div className="hero-inner">

        {/* ── LEFT: figure scene ── */}
        <div className="hero-left">
          <div className="figure-scene" ref={figureWrapRef}>

            {/* Atmospheric aura behind figure */}
            <div className="figure-aura" ref={auraRef} />

            {/* Decorative rotating rings */}
            <div className="figure-ring" ref={ringOuterRef} />
            <div className="figure-ring figure-ring--inner" ref={ringInnerRef} />

            {/* Light rays */}
            <div className="figure-rays">
              {rayAngles.map((angle, i) => (
                <div key={i} className="figure-ray"
                  ref={el => lightRaysRef.current[i] = el}
                  style={{ '--ray-angle': `${angle}deg` }}
                />
              ))}
            </div>

            {/* Inner body glow */}
            <div className="figure-inner-glow" />

            {/* Image stack */}
            <img src={prof} alt="" className="figure-img figure-img--blue" ref={imgBlueRef} aria-hidden="true" />
            <img src={prof} alt="" className="figure-img figure-img--red"  ref={imgRedRef}  aria-hidden="true" />
            <img src={prof} alt="Albin" className="figure-img figure-img--main" ref={imgMainRef} />

            {/* Figure scanline */}
            <div className="figure-scanline" ref={figScanRef} />

            {/* Edge vignette — dissolves edges into background */}
            <div className="figure-vignette" ref={vignetteRef} />

            {/* Ground glow */}
            <div className="figure-floor-glow" ref={floorRef} />

            {/* Floating orbs */}
            {orbPositions.map((pos, i) => (
              <div key={i} className={`figure-orb figure-orb--${i}`}
                ref={el => orbsRef.current[i] = el}
                style={pos}
              />
            ))}

            {/* Status badge */}
          

          </div>
        </div>

        {/* ── RIGHT: text ── */}
        <div className="hero-right" ref={rightRef}>
          <span className="hero-label" ref={labelRef}>
            <span className="label-line" />
            Python Fullstack Dev
          </span>
          <h1 className="hero-name" ref={nameRef}>
            Hi, I'm <span>Albin</span>
            <span className="cursor-blink">_</span>
          </h1>
          <p className="hero-role" ref={roleRef}>Building Things That Matter</p>
          <p className="hero-bio" ref={bioRef}>
            Building robust backends and elegant frontends —
            turning ideas into real, scalable products.
          </p>
          <div className="hero-actions" ref={actionsRef}>
            <button className="btn-ghost" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              View Work <span className="btn-arrow">→</span>
            </button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-ghost">GitHub ↗</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn-ghost">LinkedIn ↗</a>
          </div>
        </div>

      </div>

      <div className="scroll-hint">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}