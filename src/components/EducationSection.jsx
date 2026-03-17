import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './CSS/EducationSection.css';

const EDUCATION = [
  {
    id: 1,
    degree: 'B.Tech in Computer Science',
    field: 'Computer Science & Engineering',
    institution: "St Joseph's College of Engineering & Technology, Palai",
    year: '2022 – 2026',
    grade: '7.67',
    gradeLabel: 'CGPA',
    skills: ['Data Structures', 'Algorithms', 'DBMS', 'Operating Systems', 'Networks'],
    icon: '🎓',
    side: 'left',
  },
  {
    id: 2,
    degree: 'Higher Secondary',
    field: 'Science Stream',
    institution: 'Higher Secondary Education Kerala',
    year: '2020 – 2022',
    grade: '97%',
    gradeLabel: 'Score',
    skills: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
    icon: '📚',
    side: 'right',
  },
  {
    id: 3,
    degree: 'High School',
    field: 'General Studies',
    institution: 'Central Board of Secondary Education',
    year: '2020',
    grade: '88%',
    gradeLabel: 'Score',
    skills: ['Science', 'Mathematics', 'English', 'Social Studies'],
    icon: '🏫',
    side: 'left',
  },
];

const SYMBOLS = [
  'B.Tech','CGPA','7.67','CSE','A+',
  '∑','∫','λ','∞','π',
  'ML','AI','SQL','97%','88%',
  '<edu/>','#learn','dev()','{ }','CBSE',
];

export default function EducationSection() {
  const sectionRef  = useRef(null);
  const canvasRef   = useRef(null);
  const lineRef     = useRef(null);
  const titleRef    = useRef(null);
  const subRef      = useRef(null);
  const cardsRef    = useRef([]);
  const nodesRef    = useRef([]);
  const yearsRef    = useRef([]);
  const progressRef = useRef(null);

  /* ── Particle canvas ── */
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

    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.6 + 0.4, base: Math.random() * 0.35 + 0.12,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx*dx + dy*dy);
        if (d < 90) { p.vx += dx/d*0.03; p.vy += dy/d*0.03; }
        const lit = d < 90;
        ctx.beginPath();
        ctx.arc(p.x, p.y, lit ? p.r*1.5 : p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(212,190,228,${lit ? Math.min(1, p.base + (1-d/90)*0.5) : p.base})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i+1; j < pts.length; j++) {
        const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 105) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(155,126,189,${0.2*(1-d/105)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouse); };
  }, []);

  /* ── Header reveal ── */
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      gsap.timeline()
        .fromTo(subRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo(titleRef.current, { y: 60, opacity: 0, skewY: 5 }, { y: 0, opacity: 1, skewY: 0, duration: 1.1, ease: 'power4.out' }, '-=0.3');

      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, duration: 3, ease: 'power2.inOut', delay: 0.5 }
        );
      }
      obs.disconnect();
    }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Card scroll reveal ── */
  useEffect(() => {
    const observers = [];
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const isLeft = EDUCATION[i].side === 'left';
      const o = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;

        // Node burst + spin
        const node = nodesRef.current[i];
        if (node) {
          gsap.fromTo(node, { scale: 0, opacity: 0, rotate: -200 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.9, ease: 'back.out(2.5)' });
          gsap.to(node.querySelector('.edu-node-ring'), { rotate: 360, duration: 7, ease: 'none', repeat: -1, delay: 1 });
          gsap.to(node.querySelector('.edu-node-ring--outer'), { rotate: -360, duration: 11, ease: 'none', repeat: -1, delay: 1 });
          gsap.to(node, { boxShadow: '0 0 36px rgba(212,190,228,0.8), 0 0 70px rgba(155,126,189,0.45)', duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 });
        }

        // Year badge
        const yr = yearsRef.current[i];
        if (yr) gsap.fromTo(yr, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.25 });

        // Card slide
        gsap.fromTo(card,
          { x: isLeft ? -100 : 100, opacity: 0, rotateY: isLeft ? -15 : 15 },
          {
            x: 0, opacity: 1, rotateY: 0, duration: 1.05, ease: 'power3.out', delay: 0.1,
            onComplete: () => {
              gsap.fromTo(card.querySelectorAll('.edu-badge'),
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.5)', stagger: 0.08 }
              );
              const gradeEl = card.querySelector('.edu-grade-num');
              if (gradeEl) gsap.fromTo(gradeEl, { opacity: 0, y: 12, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(2)' });
              const connector = card.querySelector('.edu-connector-line');
              if (connector) gsap.fromTo(connector, { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: 'power2.out', transformOrigin: isLeft ? 'right center' : 'left center' });
            }
          }
        );
        o.disconnect();
      }, { threshold: 0.2 });
      o.observe(card);
      observers.push(o);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  /* ── 3-D tilt on hover ── */
  useEffect(() => {
    const cleanups = [];
    cardsRef.current.forEach(card => {
      if (!card) return;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height/2) / r.height) * 9;
        const ry = ((e.clientX - r.left - r.width/2) / r.width) * -9;
        gsap.to(card, { rotateX: rx, rotateY: ry, scale: 1.025, duration: 0.3, ease: 'power2.out', transformPerspective: 900 });
      };
      const onLeave = () => gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.55, ease: 'power2.inOut' });
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      cleanups.push(() => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); });
    });
    return () => cleanups.forEach(fn => fn());
  }, []);

  /* ── Floating symbols ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const nodes = SYMBOLS.map((text, i) => {
      const el = document.createElement('span');
      el.className = 'edu-symbol';
      el.textContent = text;
      const left = i % 2 === 0;
      el.style.left = `${left ? Math.random()*13+1 : Math.random()*13+84}%`;
      el.style.top  = `${Math.random()*80+8}%`;
      el.style.opacity = '0';
      section.appendChild(el);
      return el;
    });
    gsap.to(nodes, { opacity: 0.38, scale: 1, duration: 0.7, ease: 'power2.out', stagger: { each: 0.07, from: 'random' }, delay: 0.5 });
    nodes.forEach(n => gsap.to(n, { y: `+=${Math.random()*26-13}`, x: `+=${Math.random()*16-8}`, rotation: Math.random()*8-4, duration: Math.random()*4+2.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: Math.random()*2 }));

    let ft;
    const flicker = () => {
      const el = nodes[Math.floor(Math.random()*nodes.length)];
      gsap.timeline()
        .to(el, { opacity: 1, color: '#E8D5FF', scale: 1.35, textShadow: '0 0 18px rgba(232,213,255,0.9)', duration: 0.1 })
        .to(el, { opacity: 0.35, color: '#9B7EBD', scale: 1, textShadow: '0 0 8px rgba(155,126,189,0.4)', duration: 0.45, ease: 'power2.out' });
      ft = setTimeout(flicker, Math.random()*900+500);
    };
    ft = setTimeout(flicker, 2000);

    const onMove = (e) => {
      const cx = window.innerWidth/2, cy = window.innerHeight/2;
      nodes.forEach((n, i) => gsap.to(n, { x: (e.clientX-cx)*((i%3+1)*0.004), y: (e.clientY-cy)*((i%3+1)*0.004), duration: 1.6, ease: 'power1.out', overwrite: 'auto' }));
    };
    window.addEventListener('mousemove', onMove);
    return () => { clearTimeout(ft); window.removeEventListener('mousemove', onMove); nodes.forEach(n => n.remove()); };
  }, []);

  /* ── Section progress bar ── */
  useEffect(() => {
    const section = sectionRef.current, bar = progressRef.current;
    if (!section || !bar) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, (-rect.top / Math.max(section.offsetHeight - window.innerHeight, 1))*100));
      bar.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Scanline ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scan = document.createElement('div');
    scan.className = 'edu-scanline';
    section.appendChild(scan);
    gsap.to(scan, { y: '100vh', duration: 7, ease: 'none', repeat: -1, delay: 1 });
    return () => scan.remove();
  }, []);

  return (
    <section className="edu-section" ref={sectionRef} id="education">
      <canvas ref={canvasRef} className="edu-canvas" />

      <div className="edu-progress-wrap">
        <div className="edu-progress-bar" ref={progressRef} />
      </div>

      <div className="edu-glow edu-glow-tl" />
      <div className="edu-glow edu-glow-br" />
      <div className="edu-glow edu-glow-mid" />

      <div className="edu-corner edu-corner-tl"><span /><span /></div>
      <div className="edu-corner edu-corner-br"><span /><span /></div>

      <div className="edu-inner">

        {/* Header */}
        <div className="edu-header">
          <span className="edu-label" ref={subRef}>
            <span className="label-dash" />
            Academic Journey
            <span className="label-dash label-dash--rev" />
          </span>
          <h2 className="edu-title" ref={titleRef}>
            Education<span className="title-accent">.</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="edu-timeline">

          {/* Spine */}
          <div className="timeline-track">
            <div className="timeline-line" ref={lineRef} />
          </div>

          {EDUCATION.map((edu, i) => (
            <div key={edu.id} className={`edu-row edu-row--${edu.side}`}>

              {/* Left slot */}
              <div className="edu-slot">
                {edu.side === 'left' && (
                  <div className="edu-card" ref={el => cardsRef.current[i] = el}>
                    <div className="edu-connector-line edu-connector-line--left" />
                    <div className="edu-card-top">
                      <span className="edu-icon">{edu.icon}</span>
                      <div className="edu-grade-box">
                        <span className="edu-grade-label">{edu.gradeLabel}</span>
                        <span className="edu-grade-num">{edu.grade}</span>
                      </div>
                    </div>
                    <div className="edu-card-divider" />
                    <h3 className="edu-degree">{edu.degree}</h3>
                    <p className="edu-field">{edu.field}</p>
                    <p className="edu-institution">{edu.institution}</p>
                    <div className="edu-badges">
                      {edu.skills.map(s => <span className="edu-badge" key={s}>{s}</span>)}
                    </div>
                    <div className="edu-card-corner tl" />
                    <div className="edu-card-corner br" />
                  </div>
                )}
              </div>

              {/* Center node */}
              <div className="edu-node-col">
                <div className="edu-node" ref={el => nodesRef.current[i] = el}>
                  <div className="edu-node-core" />
                  <div className="edu-node-ring" />
                  <div className="edu-node-ring edu-node-ring--outer" />
                </div>
                <div className="edu-year-badge" ref={el => yearsRef.current[i] = el}>
                  {edu.year}
                </div>
              </div>

              {/* Right slot */}
              <div className="edu-slot">
                {edu.side === 'right' && (
                  <div className="edu-card" ref={el => cardsRef.current[i] = el}>
                    <div className="edu-connector-line edu-connector-line--right" />
                    <div className="edu-card-top">
                      <span className="edu-icon">{edu.icon}</span>
                      <div className="edu-grade-box">
                        <span className="edu-grade-label">{edu.gradeLabel}</span>
                        <span className="edu-grade-num">{edu.grade}</span>
                      </div>
                    </div>
                    <div className="edu-card-divider" />
                    <h3 className="edu-degree">{edu.degree}</h3>
                    <p className="edu-field">{edu.field}</p>
                    <p className="edu-institution">{edu.institution}</p>
                    <div className="edu-badges">
                      {edu.skills.map(s => <span className="edu-badge" key={s}>{s}</span>)}
                    </div>
                    <div className="edu-card-corner tl" />
                    <div className="edu-card-corner br" />
                  </div>
                )}
              </div>

            </div>
          ))}

          {/* End node */}
          <div className="timeline-end">
            <div className="timeline-end-dot" />
            <span className="timeline-end-label">Ongoing · 2026</span>
          </div>

        </div>
      </div>
    </section>
  );
}