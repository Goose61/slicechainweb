"use client";

import { useEffect, useState } from "react";
import { brandName, logo, navLinks, portalPath, social } from "@/content/landing-content";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`landing-header${scrolled ? " is-scrolled" : ""}`} id="landing-header">
        <nav className={`nav nav-compact${scrolled ? " scrolled" : ""}`} id="nav">
          <div className="nav-top">
            <a href="#home" className="nav-left brand-link">
              <div className="brand">
                <img src={logo} alt={brandName} />
                <span className="brand-wordmark">{brandName}</span>
              </div>
            </a>
            <button
              type="button"
              className="nav-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`nav-drawer-overlay${menuOpen ? " open" : ""}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />
      <aside className={`nav-drawer${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <div className="nav-drawer-head">
          <div className="brand">
            <img src={logo} alt={brandName} />
            <span className="brand-wordmark">{brandName}</span>
          </div>
          <button type="button" className="nav-drawer-close" onClick={closeMenu} aria-label="Close menu">
            <span className="nav-drawer-close-icon" aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="nav-drawer-links">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="link" onClick={closeMenu}>
              <span className="num">{link.num}</span>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav-drawer-actions">
          <a href={portalPath} className="btn btn-ghost" onClick={closeMenu}>
            Portal <span className="arrow">→</span>
          </a>
          <a href={social.email} className="btn btn-gold" onClick={closeMenu}>
            Contact <span className="arrow">→</span>
          </a>
        </div>
      </aside>
    </>
  );
}
