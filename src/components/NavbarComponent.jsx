import React, { useRef, useState, useEffect } from 'react';
import './CSS/NavbarComponent.css';

const navLinks = [
  { label: 'Home',     id: 'home' },
  { label: 'About',    id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills',   id: 'skills' },
  { label: 'Contact',  id: 'contact' },
];

function NavbarComponent() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  };

  // close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  // close when screen widens past breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 680) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="navbar-wrapper">
      <nav ref={navRef} className="navbar" onMouseMove={handleMouseMove}>
        <div className="glow-cursor" style={{ left: mousePos.x, top: mousePos.y }} />

        <div className="brand" onClick={() => scrollTo('home')} style={{ cursor: 'pointer' }}>
          ALBIN<span>.</span>
          <span className="brand-tag">Python Fullstack Developer</span>
        </div>

        <ul className="nav-links">
          {navLinks.map(({ label, id }) => (
            <li key={label}>
              <a className="nav-link" onClick={() => scrollTo(id)}>
                <span className="nav-dot" />
                <span className="nav-link-shine" />
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button className="cta-btn" onClick={() => scrollTo('contact')}>Hire Me</button>

        <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <span /><span /><span />
        </div>

        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          {navLinks.map(({ label, id }) => (
            <div key={label} className="mobile-link" onClick={() => scrollTo(id)}>
              {label}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default NavbarComponent;