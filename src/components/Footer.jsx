import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CSS/Footer.css';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Contact', id: 'contact' },
];

const socials = [
  { label: 'GitHub', href: 'https://github.com', sym: 'GH' },
  { label: 'LinkedIn', href: 'https://linkedin.com', sym: 'LN' },
  { label: 'Email', href: 'mailto:albinshaju2003@gmail.com', sym: '@' },
];

export default function Footer() {
  const footerRef = useRef(null);
  const brandRef = useRef(null);
  const lineRef = useRef(null);
  const colsRef = useRef([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(brandRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 88%' }
        }
      );

      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1, ease: 'power3.inOut',
          scrollTrigger: { trigger: footerRef.current, start: 'top 85%' }
        }
      );

      gsap.fromTo(colsRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.12,
          scrollTrigger: { trigger: footerRef.current, start: 'top 85%' }
        }
      );

      gsap.fromTo(bottomRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.5,
          scrollTrigger: { trigger: footerRef.current, start: 'top 85%' }
        }
      );

    }, footerRef);
    return () => ctx.revert();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="footer" ref={footerRef}>

      {/* top orb */}
      <div className="footer-orb" />

      {/* BRAND ROW */}
      <div className="footer-brand-row" ref={brandRef}>
        <div className="footer-brand">
          ALBIN<span>.</span>
          <p className="footer-brand-sub">Python Fullstack Developer</p>
        </div>
        <p className="footer-tagline">
          Building clean backends &amp; elegant frontends — one commit at a time.
        </p>
      </div>

      {/* DIVIDER */}
      <div className="footer-line-wrap">
        <div className="footer-line" ref={lineRef} />
      </div>

      {/* COLUMNS */}
      <div className="footer-cols">

        <div className="footer-col" ref={el => colsRef.current[0] = el}>
          <p className="footer-col-head">Navigation</p>
          <ul className="footer-nav">
            {navLinks.map(({ label, id }) => (
              <li key={id}>
                <button className="footer-nav-link" onClick={() => scrollTo(id)}>
                  <span className="fnl-dot" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col" ref={el => colsRef.current[1] = el}>
          <p className="footer-col-head">Connect</p>
          <ul className="footer-nav">
            {socials.map(s => (
              <li key={s.label}>
                <a href={s.href} className="footer-nav-link" target="_blank" rel="noreferrer">
                  <span className="fnl-sym">{s.sym}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col" ref={el => colsRef.current[2] = el}>
          <p className="footer-col-head">Contact</p>
          <ul className="footer-nav">
            <li><a href="mailto:albinshaju2003@gmail.com" className="footer-nav-link footer-nav-link--plain">albinshaju2003@gmail.com</a></li>
            <li><a href="tel:+919061564018" className="footer-nav-link footer-nav-link--plain">+91 90615 64018</a></li>
            <li><span className="footer-nav-link footer-nav-link--plain footer-location">📍 Kottayam, Kerala</span></li>
          </ul>
        </div>

        <div className="footer-col footer-col-avail" ref={el => colsRef.current[3] = el}>
          <div className="footer-avail-card">
            <span className="footer-avail-dot" />
            <p className="footer-avail-status">Available for work</p>
            <p className="footer-avail-date">March 2026</p>
            <button className="footer-avail-btn" onClick={() => scrollTo('contact')}>
              Hire Me →
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom" ref={bottomRef}>
        <div className="footer-bottom-line" />
        <div className="footer-bottom-inner">
          <p>© 2026 Albin Shaju. All rights reserved.</p>
          <p className="footer-built">Built with React &amp; ⚡</p>
        </div>
      </div>

    </footer>
  );
}