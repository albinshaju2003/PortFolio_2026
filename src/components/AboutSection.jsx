import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './CSS/AboutSection.css';

const cards = [
  {
    icon: '🎓',
    title: 'Education',
    items: ['B.Tech CSE · CGPA 7.67', 'Higher Secondary · 97%', 'High School · 88%'],
  },
  {
    icon: '💼',
    title: 'Internships',
    items: ['Python Full Stack Dev @ Luminar TechnoLab', 'Python Intern @ Technovalley, Kochi'],
  },
  {
    icon: '🏆',
    title: 'Achievement',
    items: ['ASTHRA Tech Fest', 'Technical Event Coordinator', 'Led execution of tech events'],
  },
  {
    icon: '🧠',
    title: 'Strengths',
    items: ['Problem Solving', 'Team Leadership', 'Adaptable & Self-driven', 'Clean Code Advocate'],
  },
];

const SKILLS = [
  'Python', 'Django', 'React', 'FastAPI', 'PostgreSQL',
  'Redis', 'Docker', 'REST APIs', 'Git', 'JavaScript',
  'Tailwind CSS', 'Celery', 'AWS S3', 'Linux', 'WebSockets',
];

export default function AboutSection() {
  const sectionRef  = useRef(null);
  const canvasRef   = useRef(null);
  const eyebrowRef  = useRef(null);
  const titleWrapRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardRefs    = useRef([]);
  const skillsRef   = useRef(null);
  const hasAnimated = useRef(false);

  /* ── Canvas: particle net ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r:  Math.random() * 1.6 + 0.4,
      a:  Math.random() * 0.45 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,190,228,${p.a})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(155,126,189,${0.22*(1-d/115)})`;
            ctx.lineWidth   = 0.65;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  /* ── GSAP cinematic scroll reveal ── */
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const tl = gsap.timeline();

        /* 1. Eyebrow flies down from above */
        tl.to(eyebrowRef.current, {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        })

        /* 2. Title slams up with slight overshoot */
        .to(titleWrapRef.current, {
          y: 0, opacity: 1, duration: 1, ease: 'expo.out',
        }, '-=0.3')

        /* 3. Subtitle fades up */
        .to(subtitleRef.current, {
          y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
        }, '-=0.4')

        /* 4. Cards stagger in with scale */
        .to(cardRefs.current, {
          y: 0, opacity: 1, scale: 1,
          duration: 0.65, ease: 'power3.out',
          stagger: 0.1,
        }, '-=0.3')

        /* 5. Skills block */
        .to(skillsRef.current, {
          y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        }, '-=0.2');

        /* 6. Glow pulse on "Me" after reveal */
        tl.add(() => {
          const me = titleWrapRef.current?.querySelector('.accent');
          if (me) {
            gsap.to(me, {
              textShadow: '0 0 40px rgba(212,190,228,1), 0 0 80px rgba(155,126,189,0.9), 0 0 120px rgba(155,126,189,0.4)',
              duration: 0.4, ease: 'power2.out', yoyo: true, repeat: 1,
            });
          }
        }, '-=0.1');

        observer.disconnect();
      });
    }, { threshold: 0.07 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── Card hover ── */
  const onEnter = i => gsap.to(cardRefs.current[i], { y: -8, duration: 0.25, ease: 'power2.out' });
  const onLeave = i => gsap.to(cardRefs.current[i], { y:  0, duration: 0.3,  ease: 'power2.inOut' });

  /* ── Set initial GSAP state (invisible) inline so no flash ── */
  useEffect(() => {
    gsap.set(eyebrowRef.current,   { y: -20, opacity: 0 });
    gsap.set(titleWrapRef.current, { y: 30,  opacity: 0 });
    gsap.set(subtitleRef.current,  { y: 20,  opacity: 0 });
    gsap.set(cardRefs.current,     { y: 45,  opacity: 0, scale: 0.95 });
    gsap.set(skillsRef.current,    { y: 24,  opacity: 0 });
  }, []);

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <canvas ref={canvasRef} className="about-canvas" />

      <div className="about-glow about-glow-tl" />
      <div className="about-glow about-glow-br" />
      <div className="about-glow about-glow-center" />

      <div className="about-corner about-corner-tl"><span /><span /></div>
      <div className="about-corner about-corner-br"><span /><span /></div>

      <div className="about-inner">

        {/* ── HEADER ── */}
        <div className="about-header">

          <p className="about-eyebrow" ref={eyebrowRef}>
            <span className="eyebrow-line" />
            Get to know me
            <span className="eyebrow-line" style={{ background: 'linear-gradient(270deg, #C8AAFF, transparent)' }} />
          </p>

          <div className="about-title-wrap" ref={titleWrapRef}>
            <h2 className="about-title">
              About <span className="accent">Me</span>
              <span className="title-cursor">_</span>
            </h2>
          </div>

          <p className="about-subtitle" ref={subtitleRef}>
            A Computer Science graduate from Kerala — building full-stack web apps
            with Python backends and clean React frontends.
          </p>

        </div>

        {/* ── CARDS ── */}
        <div className="cards-grid">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="info-card"
              ref={el => cardRefs.current[i] = el}
              onMouseEnter={() => onEnter(i)}
              onMouseLeave={() => onLeave(i)}
            >
              <div className="card-glow-dot" />
              <div className="info-card-top">
                <span className="info-icon">{card.icon}</span>
                <h3 className="info-title">{card.title}</h3>
              </div>
              <ul className="info-items">
                {card.items.map((item, j) => (
                  <li key={j} className="info-item">
                    <span className="info-dot" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── SKILLS ── */}
        <div className="skills-block" ref={skillsRef}>
          <p className="about-eyebrow" style={{ marginBottom: '22px' }}>
            <span className="eyebrow-line" />
            Tech Stack
            <span className="eyebrow-line" style={{ background: 'linear-gradient(270deg, #C8AAFF, transparent)' }} />
          </p>
          <div className="skills-wrap">
            {SKILLS.map((skill, i) => (
              <span
                key={skill}
                className="skill-pill"
                style={{ animationDelay: `${i * 0.055 + 0.9}s` }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}