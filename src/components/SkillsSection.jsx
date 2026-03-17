import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './CSS/SkillsSection.css';

const CATEGORIES = [
  {
    label: 'Backend',
    icon: '⚙️',
    color: '#9B7EBD',
    glow: 'rgba(155,126,189,0.5)',
    skills: [
      { name: 'Python',    level: 92 },
      { name: 'Django',    level: 88 },
      { name: 'Flask',     level: 78 },
      { name: 'MySQL',     level: 80 },
      { name: 'MongoDB',   level: 70 },
    ],
  },
  {
    label: 'Frontend',
    icon: '🎨',
    color: '#7C9EE8',
    glow: 'rgba(124,158,232,0.5)',
    skills: [
      { name: 'React',       level: 85 },
      { name: 'JavaScript',  level: 82 },
      { name: 'HTML & CSS',  level: 90 },
      { name: 'Tailwind CSS',level: 80 },
      { name: 'GSAP',        level: 68 },
    ],
  },
  {
    label: 'Tools & Others',
    icon: '🚀',
    color: '#7ECFA8',
    glow: 'rgba(126,207,168,0.5)',
    skills: [
      { name: 'Git',        level: 88 },
      { name: 'Firebase',   level: 75 },
      { name: 'C',          level: 78 },
      { name: 'SQL',        level: 82 },
      { name: 'Linux',      level: 70 },
    ],
  },
];

const STATS = [
  { value: 3,  suffix: '+', label: 'Projects Built' },
  { value: 2,  suffix: '',  label: 'Internships' },
  { value: 9,  suffix: '+', label: 'Technologies' },
  { value: 3,  suffix: '+', label: 'Years Project Experience' },
];

export default function SkillsSection() {
  const sectionRef  = useRef(null);
  const canvasRef   = useRef(null);
  const headRef     = useRef(null);
  const statsRef    = useRef([]);
  const catRefs     = useRef([]);
  const barRefs     = useRef({});
  const countRefs   = useRef({});
  const hasAnimated = useRef(false);

  /* ── Canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({length:40},()=>({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25,
      r:Math.random()*1.4+.3, a:Math.random()*.35+.1,
    }));
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>canvas.width) p.vx*=-1;
        if(p.y<0||p.y>canvas.height) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(212,190,228,${p.a})`; ctx.fill();
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<100){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(155,126,189,${.18*(1-d/100)})`; ctx.lineWidth=.55; ctx.stroke(); }
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize); };
  },[]);

  /* ── GSAP reveal + bar fill + counter ── */
  useEffect(() => {
    gsap.set(headRef.current, { y:50, opacity:0 });
    gsap.set(statsRef.current, { y:40, opacity:0, scale:0.9 });
    gsap.set(catRefs.current, { y:60, opacity:0 });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const tl = gsap.timeline();

        tl.to(headRef.current, { y:0, opacity:1, duration:.9, ease:'power3.out' })
          .to(statsRef.current, { y:0, opacity:1, scale:1, duration:.65, ease:'back.out(1.4)', stagger:.1 }, '-=.4')
          .to(catRefs.current,  { y:0, opacity:1, duration:.7, ease:'power3.out', stagger:.12 }, '-=.2');

        /* counter animation */
        STATS.forEach((s, i) => {
          const el = countRefs.current[i];
          if (!el) return;
          gsap.fromTo({ val: 0 }, { val: 0 }, {
            val: s.value, duration: 2, ease: 'power2.out', delay: .5 + i * .1,
            onUpdate() { el.textContent = Math.round(this.targets()[0].val) + s.suffix; },
          });
        });

        /* bar fill with stagger */
        CATEGORIES.forEach((cat, ci) => {
          cat.skills.forEach((skill, si) => {
            const bar = barRefs.current[`${ci}-${si}`];
            if (bar) {
              gsap.fromTo(bar,
                { width: '0%' },
                { width: `${skill.level}%`, duration:1.2, ease:'power2.out', delay:.8 + ci*.15 + si*.08 }
              );
            }
          });
        });

        observer.disconnect();
      });
    }, { threshold:.07 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const onCatEnter = i => gsap.to(catRefs.current[i], { y:-6, duration:.25, ease:'power2.out' });
  const onCatLeave = i => gsap.to(catRefs.current[i], { y:0,  duration:.3,  ease:'power2.inOut' });

  return (
    <section className="skills-section" id="skills" ref={sectionRef}>
      <canvas ref={canvasRef} className="skills-canvas" />
      <div className="skills-glow skills-glow-tl" />
      <div className="skills-glow skills-glow-br" />
      <div className="sk-corner sk-corner-tl"><span/><span/></div>
      <div className="sk-corner sk-corner-br"><span/><span/></div>

      <div className="skills-inner">

        {/* HEADER */}
        <div className="skills-header" ref={headRef}>
          <p className="sk-eyebrow">
            <span className="eyebrow-line" />
            Under the Hood
            <span className="eyebrow-line eyebrow-line-r" />
          </p>
          <div className="sk-title-wrap">
            <h2 className="sk-title">
              My <span className="accent">Skills</span>
              <span className="title-cursor">_</span>
            </h2>
          </div>
          <p className="sk-subtitle">
            Technologies I use daily to build fast, scalable, and beautiful products.
          </p>
        </div>

        {/* STATS ROW */}
        <div className="stats-row">
          {STATS.map((s, i) => (
            <div key={i} className="stat-card" ref={el => statsRef.current[i] = el}>
              <span className="stat-value" ref={el => countRefs.current[i] = el}>0{s.suffix}</span>
              <span className="stat-label">{s.label}</span>
              <div className="stat-bar-bg"><div className="stat-bar-fill" style={{ '--w': `${(s.value/100)*100}%` }} /></div>
            </div>
          ))}
        </div>

        {/* SKILL CATEGORIES */}
        <div className="skills-grid">
          {CATEGORIES.map((cat, ci) => (
            <div
              key={cat.label}
              className="skill-cat"
              ref={el => catRefs.current[ci] = el}
              onMouseEnter={() => onCatEnter(ci)}
              onMouseLeave={() => onCatLeave(ci)}
              style={{ '--cat-color': cat.color, '--cat-glow': cat.glow }}
            >
              <div className="skill-cat-header">
                <span className="skill-cat-icon">{cat.icon}</span>
                <h3 className="skill-cat-label">{cat.label}</h3>
              </div>
              <div className="skill-bars">
                {cat.skills.map((skill, si) => (
                  <div key={skill.name} className="skill-row">
                    <div className="skill-row-top">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-pct">{skill.level}%</span>
                    </div>
                    <div className="skill-bar-track">
                      <div
                        className="skill-bar-fill"
                        ref={el => barRefs.current[`${ci}-${si}`] = el}
                        style={{ '--color': cat.color, '--glow': cat.glow }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}