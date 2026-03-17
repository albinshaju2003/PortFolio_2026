import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './CSS/ProjectsSection.css';

const PROJECTS = [
  {
    id: 'proj-1',
    tag: 'Marketplace · Django',
    title: 'Help N Hands',
    date: 'Dec 2025 – Feb 2026',
    desc: 'A comprehensive marketplace platform bridging resource owners and users via an on-demand lending model — supporting rental of high-value machinery and hiring of skilled labor on a daily-wage basis.',
    stack: ['Django', 'Python', 'MySQL', 'HTML/CSS', 'JavaScript'],
    accent: '#9B7EBD',
    glow: 'rgba(155,126,189,0.35)',
    link: '#',
    repo: '#',
    num: '01',
  },
  {
    id: 'proj-2',
    tag: 'Location · Full Stack',
    title: 'FlexiLink',
    date: 'Jan 2024 – Jul 2024',
    desc: 'An integrated platform for discovering nearby gyms on a pay-per-day basis. Features location-based gym search, a revenue management module for gym owners, and seamless daily-pass to membership transitions.',
    stack: ['React', 'Python', 'MySQL', 'Firebase', 'JavaScript'],
    accent: '#7C9EE8',
    glow: 'rgba(124,158,232,0.35)',
    link: '#',
    repo: '#',
    num: '02',
  },
  {
    id: 'proj-3',
    tag: 'AI · Surveillance',
    title: 'Eye-Q',
    date: 'Feb 2024 – Apr 2025',
    desc: 'An intelligent home surveillance platform that monitors environments and generates event summaries from captured footage. Supports natural-language event search, automated alerts, and real-time monitoring.',
    stack: ['ReactJS', 'Python Flask', 'Firebase', 'MongoDB', 'HTML/CSS'],
    accent: '#7ECFA8',
    glow: 'rgba(126,207,168,0.35)',
    link: '#',
    repo: '#',
    num: '03',
  },
  {
    id: 'proj-4',
    tag: 'E-Commerce · Full Stack',
    title: 'ShopForge',
    date: 'In Progress',
    desc: 'A full-featured e-commerce platform with product listings, cart management, order tracking, secure payments, and an admin dashboard — built with Django REST Framework backend and React frontend.',
    stack: ['Django', 'React', 'MySQL', 'JavaScript', 'Tailwind CSS'],
    accent: '#E87CB0',
    glow: 'rgba(232,124,176,0.35)',
    link: '#',
    repo: '#',
    num: '04',
  },
];

export default function ProjectsSection() {
  const sectionRef  = useRef(null);
  const canvasRef   = useRef(null);
  const headRef     = useRef(null);
  const cardRefs    = useRef([]);
  const hasAnimated = useRef(false);

  /* ── Canvas particle net ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3, a: Math.random() * 0.4 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(212,190,228,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i+1; j < pts.length; j++) {
        const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle = `rgba(155,126,189,${0.2*(1-d/110)})`; ctx.lineWidth=0.6; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  /* ── GSAP scroll reveal ── */
  useEffect(() => {
    gsap.set(headRef.current,   { y: 50, opacity: 0 });
    gsap.set(cardRefs.current,  { y: 80, opacity: 0, rotateX: 8 });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        gsap.to(headRef.current, { y:0, opacity:1, duration:0.9, ease:'power3.out' });
        gsap.to(cardRefs.current, {
          y:0, opacity:1, rotateX:0,
          duration:0.8, ease:'power3.out',
          stagger:0.13, delay:0.25,
        });
        observer.disconnect();
      });
    }, { threshold: 0.07 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── 3D card tilt on mouse ── */
  const onCardMove = (e, i) => {
    const card = cardRefs.current[i];
    if (!card) return;
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const rx = -(e.clientY - cy) / (r.height / 2) * 8;
    const ry =  (e.clientX - cx) / (r.width  / 2) * 8;
    gsap.to(card, { rotateX:rx, rotateY:ry, scale:1.03, duration:0.3, ease:'power2.out', transformPerspective:800 });
    /* move inner glow toward mouse */
    const gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const gy = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    card.style.setProperty('--gx', `${gx}%`);
    card.style.setProperty('--gy', `${gy}%`);
  };
  const onCardLeave = (i) => {
    gsap.to(cardRefs.current[i], { rotateX:0, rotateY:0, scale:1, duration:0.5, ease:'power2.inOut' });
  };

  return (
    <section className="projects-section" id="projects" ref={sectionRef}>
      <canvas ref={canvasRef} className="projects-canvas" />
      <div className="projects-glow projects-glow-tl" />
      <div className="projects-glow projects-glow-br" />
      <div className="proj-corner proj-corner-tl"><span /><span /></div>
      <div className="proj-corner proj-corner-br"><span /><span /></div>

      <div className="projects-inner">

        {/* HEADER */}
        <div className="projects-header" ref={headRef}>
          <p className="proj-eyebrow">
            <span className="eyebrow-line" />
            What I've Built
            <span className="eyebrow-line eyebrow-line-r" />
          </p>
          <div className="proj-title-wrap">
            <h2 className="proj-title">
              Featured <span className="accent">Projects</span>
              <span className="title-cursor">_</span>
            </h2>
          </div>
          <p className="proj-subtitle">
            A selection of work I'm proud of — each one solving a real problem with clean code.
          </p>
        </div>

        {/* CARDS */}
        <div className="proj-grid">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className="proj-card"
              ref={el => cardRefs.current[i] = el}
              onMouseMove={e => onCardMove(e, i)}
              onMouseLeave={() => onCardLeave(i)}
              style={{ '--accent': p.accent, '--glow': p.glow }}
            >
              <div className="proj-card-shine" />

              <div className="proj-card-top">
                <span className="proj-tag">{p.tag}</span>
                <span className="proj-date">{p.date}</span>
                <span className="proj-num">{p.num}</span>
              </div>

              <h3 className="proj-card-title">{p.title}</h3>
              <p  className="proj-card-desc">{p.desc}</p>

              <div className="proj-stack">
                {p.stack.map(s => <span key={s} className="proj-chip">{s}</span>)}
              </div>

              <div className="proj-card-actions">
                <a href={p.link} className="proj-btn proj-btn-primary">
                  Live Demo <span>↗</span>
                </a>
                <a href={p.repo} className="proj-btn proj-btn-ghost">
                  GitHub <span>↗</span>
                </a>
              </div>

              {/* bottom accent line */}
              <div className="proj-card-bar" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}