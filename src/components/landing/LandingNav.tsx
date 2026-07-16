"use client";

import { useEffect, useState } from "react";
import { brandMark, logo, navLinks, portalPath, businessDemoPath } from "@/content/landing-content";
import { appUrl } from "@/lib/appUrl";
import { ContactLink } from "./ContactLink";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Absolute app URL from first paint so static HTML / pre-hydration clicks
  // never hit relative /business/demo on slicechain.io (which 404s the API).
  const demoHref = appUrl(businessDemoPath);
  const portalHref = appUrl(portalPath);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
        ticking = false;
      });
    };
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
                <img
                  src={logo}
                  alt="SlicePay crypto payment gateway logo"
                  width={36}
                  height={36}
                  decoding="async"
                />
                <span className="brand-wordmark">{brandMark}</span>
              </div>
            </a>
            <div className="nav-top-actions">
              <a
                href={demoHref}
                className="btn btn-gold nav-demo-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try Demo
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
            <img
              src={logo}
              alt="SlicePay crypto payment gateway logo"
              width={36}
              height={36}
              decoding="async"
            />
            <span className="brand-wordmark">{brandMark}</span>
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
          <a
            href={demoHref}
            className="btn btn-gold"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            Try Demo <span className="arrow">→</span>
          </a>
          <a href={portalHref} className="btn btn-ghost" onClick={closeMenu}>
            Portal <span className="arrow">→</span>
          </a>
          <ContactLink className="btn btn-gold" onClick={closeMenu}>
            Contact <span className="arrow">→</span>
          </ContactLink>
        </div>
      </aside>
    </>
  );
}
