import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import emailjs from '@emailjs/browser';
import './CSS/ContactSection.css';

const EMAILJS_SERVICE_ID  = 'service_nz1p7s3';
const EMAILJS_TEMPLATE_ID = 'template_ahhqh5d';
const EMAILJS_PUBLIC_KEY  = 'mRDW_Ciw7YFHF5AkM';

const LINKS = [
  {
    icon: '✉',
    label: 'Email',
    value: 'caraxes3690@gmail.com',
    href: 'mailto:caraxes3690@gmail.com',
    color: '#9B7EBD',
    glow: 'rgba(155,126,189,0.4)',
  },
  {
    icon: '☎',
    label: 'Phone',
    value: '+91 9061564018',
    href: 'tel:+919061564018',
    color: '#7ECFA8',
    glow: 'rgba(126,207,168,0.4)',
  },
  {
    icon: '⌁',
    label: 'LinkedIn',
    value: 'linkedin.com/in/albin-shaju',
    href: 'https://linkedin.com',
    color: '#7C9EE8',
    glow: 'rgba(124,158,232,0.4)',
  },
  {
    icon: '⌥',
    label: 'GitHub',
    value: 'github.com/albin-shaju',
    href: 'https://github.com',
    color: '#E87CB0',
    glow: 'rgba(232,124,176,0.4)',
  },
];

export default function ContactSection() {
  const sectionRef   = useRef(null);
  const canvasRef    = useRef(null);
  const headRef      = useRef(null);
  const eyebrowRef   = useRef(null);
  const titleRef     = useRef(null);
  const subtitleRef  = useRef(null);
  const linkRefs     = useRef([]);
  const formRef      = useRef(null);
  const inputRefs    = useRef([]);
  const btnRef       = useRef(null);
  const hasAnimated  = useRef(false);

  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [focused, setFocused] = useState(null);
  const [sending, setSending] = useState(false);

  /* ── Canvas particle net ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,  y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.6 + 0.3,     a: Math.random() * 0.4 + 0.12,
    }));

    /* shooting stars */
    const stars = Array.from({ length: 3 }, () => ({
      x: 0, y: 0, len: 0, speed: 0, opacity: 0, active: false, timer: Math.random() * 300 + 100,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* shooting stars */
      stars.forEach(s => {
        s.timer--;
        if (s.timer <= 0 && !s.active) {
          s.active = true;
          s.x = Math.random() * canvas.width * 0.6;
          s.y = Math.random() * canvas.height * 0.4;
          s.len = Math.random() * 100 + 50;
          s.speed = Math.random() * 3 + 2;
          s.opacity = 0.8;
          s.timer = Math.random() * 400 + 250;
        }
        if (s.active) {
          s.x += s.speed * 1.4; s.y += s.speed * 0.5; s.opacity -= 0.016;
          if (s.opacity <= 0) s.active = false;
          const g = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.35);
          g.addColorStop(0, `rgba(232,213,255,${s.opacity})`);
          g.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.len, s.y - s.len * 0.35);
          ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232,213,255,${s.opacity})`; ctx.fill();
        }
      });

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,190,228,${p.a})`; ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(155,126,189,${0.22 * (1 - d / 110)})`; ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  /* ── GSAP initial state ── */
  useEffect(() => {
    gsap.set(eyebrowRef.current,  { y: -24, opacity: 0 });
    gsap.set(titleRef.current,    { y:  36, opacity: 0 });
    gsap.set(subtitleRef.current, { y:  20, opacity: 0 });
    gsap.set(linkRefs.current,    { x: -40, opacity: 0 });
    gsap.set(formRef.current,     { y:  50, opacity: 0 });
  }, []);

  /* ── GSAP scroll reveal ── */
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const tl = gsap.timeline();

        tl.to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
          .to(titleRef.current,    { y: 0, opacity: 1, duration: 1,   ease: 'expo.out'   }, '-=0.3')
          .to(subtitleRef.current, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.4')
          .to(linkRefs.current, {
            x: 0, opacity: 1, duration: 0.65, ease: 'power3.out', stagger: 0.1,
          }, '-=0.3')
          .to(formRef.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5');

        observer.disconnect();
      });
    }, { threshold: 0.07 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── Link card hover ── */
  const onLinkEnter = i => {
    gsap.to(linkRefs.current[i], { x: 8, duration: 0.25, ease: 'power2.out' });
  };
  const onLinkLeave = i => {
    gsap.to(linkRefs.current[i], { x: 0, duration: 0.3, ease: 'power2.inOut' });
  };

  /* ── Input focus ── */
  const onFocus = i => {
    setFocused(i);
    gsap.to(inputRefs.current[i], {
      borderColor: 'rgba(155,126,189,0.6)',
      boxShadow: '0 0 0 3px rgba(155,126,189,0.12), 0 0 20px rgba(155,126,189,0.08)',
      duration: 0.25,
    });
  };
  const onBlur = i => {
    setFocused(null);
    gsap.to(inputRefs.current[i], {
      borderColor: 'rgba(212,190,228,0.12)',
      boxShadow: 'none',
      duration: 0.3,
    });
  };

  /* ── Submit ── */
  const handleSubmit = e => {
    e.preventDefault();
    setSending(true);
    gsap.to(btnRef.current, { scale: 0.96, duration: 0.1 });

    const templateParams = {
      from_name:    form.name,
      from_email:   form.email,
      subject:      form.subject,
      message:      form.message,
      reply_to:     form.email,
    };

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
      .then(() => {
        setSending(false);
        setSent(true);
        gsap.fromTo('.sent-card',
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
        );
      })
      .catch(err => {
        console.error('EmailJS error:', err);
        setSending(false);
        gsap.to(btnRef.current, { scale: 1, duration: 0.2, ease: 'back.out' });
        alert('Oops! Something went wrong. Please try again or email directly at albinshaju2003@gmail.com');
      });
  };

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <canvas ref={canvasRef} className="contact-canvas" />

      <div className="ct-glow ct-glow-tl" />
      <div className="ct-glow ct-glow-br" />
      <div className="ct-glow ct-glow-center" />

      <div className="ct-corner ct-corner-tl"><span /><span /></div>
      <div className="ct-corner ct-corner-br"><span /><span /></div>

      <div className="contact-inner">

        {/* ── HEADER ── */}
        <div className="contact-header" ref={headRef}>
          <p className="ct-eyebrow" ref={eyebrowRef}>
            <span className="eyebrow-line" />
            Let's Connect
            <span className="eyebrow-line eyebrow-line-r" />
          </p>
          <div className="ct-title-wrap" ref={titleRef}>
            <h2 className="ct-title">
              Get In <span className="accent">Touch</span>
              <span className="title-cursor">_</span>
            </h2>
          </div>
          <p className="ct-subtitle" ref={subtitleRef}>
            Open to internships, freelance projects, and full-time roles.
            I'm just one message away — I reply within 24 hours.
          </p>
        </div>

        {/* ── BODY ── */}
        <div className="contact-body">

          {/* LEFT */}
          <div className="contact-left">

            {/* availability badge */}
            <div className="avail-badge">
              <span className="avail-dot" />
              <span className="avail-text">Available for work</span>
            </div>

            {/* link cards */}
            <div className="ct-links">
              {LINKS.map((l, i) => (
                <a
                  key={i}
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="ct-link-card"
                  ref={el => linkRefs.current[i] = el}
                  onMouseEnter={() => onLinkEnter(i)}
                  onMouseLeave={() => onLinkLeave(i)}
                  style={{ '--lc': l.color, '--lg': l.glow }}
                >
                  <span className="ct-link-icon">{l.icon}</span>
                  <div className="ct-link-body">
                    <span className="ct-link-label">{l.label}</span>
                    <span className="ct-link-value">{l.value}</span>
                  </div>
                  <span className="ct-link-arrow">↗</span>
                  <div className="ct-link-glow" />
                </a>
              ))}
            </div>

            {/* location + status */}
            <div className="ct-meta">
              <div className="ct-meta-item">
                <span className="ct-meta-icon">◎</span>
                <span>Kottayam, Kerala, India</span>
              </div>
              <div className="ct-meta-item">
                <span className="ct-meta-icon">◈</span>
                <span>B.Tech CSE · CGPA 7.67</span>
              </div>
            </div>

          </div>

          {/* RIGHT — form */}
          <div className="contact-right" ref={formRef}>
            {sent ? (
              <div className="sent-card">
                <div className="sent-ring">
                  <div className="sent-check">✓</div>
                </div>
                <h3 className="sent-title">Message Sent!</h3>
                <p className="sent-sub">Thanks for reaching out, Albin will get back to you shortly.</p>
                <button
                  className="sent-reset"
                  onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }); }}
                >
                  Send Another ↩
                </button>
              </div>
            ) : (
              <form className="ct-form" onSubmit={handleSubmit} noValidate>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      ref={el => inputRefs.current[0] = el}
                      className="form-input"
                      type="text" placeholder="Your name" required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      onFocus={() => onFocus(0)} onBlur={() => onBlur(0)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      ref={el => inputRefs.current[1] = el}
                      className="form-input"
                      type="email" placeholder="you@example.com" required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      onFocus={() => onFocus(1)} onBlur={() => onBlur(1)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    ref={el => inputRefs.current[2] = el}
                    className="form-input"
                    type="text" placeholder="What's this about?"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    onFocus={() => onFocus(2)} onBlur={() => onBlur(2)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    ref={el => inputRefs.current[3] = el}
                    className="form-input form-textarea"
                    placeholder="Tell me about your project or opportunity..."
                    required rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    onFocus={() => onFocus(3)} onBlur={() => onBlur(3)}
                  />
                </div>

                <button ref={btnRef} type="submit" className="ct-submit" disabled={sending}>
                  {sending ? (
                    <><span className="sending-dots"><span/><span/><span/></span> Sending…</>
                  ) : (
                    <>Send Message <span className="submit-arrow">→</span></>
                  )}
                  <div className="btn-glow" />
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}