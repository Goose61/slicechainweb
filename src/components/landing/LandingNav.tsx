"use client";

import { useEffect, useMemo, useState } from "react";
import {
  brandMark,
  logo,
  navDemoCta,
  navLinks,
  navPositioningLine,
  navRegisterCta,
  portalPath,
  businessDemoPath,
  stickyAnnouncement,
} from "@/content/landing-content";
import { appUrl } from "@/lib/appUrl";
import {
  buildFoundingSignupHref,
  requestFoundingSignupOpen,
} from "@/lib/foundingSignup";
import { trackEvent } from "@/lib/gtag";
import { ContactLink } from "./ContactLink";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [registerHref, setRegisterHref] = useState(buildFoundingSignupHref());
  const demoHref = appUrl(businessDemoPath);
  const portalHref = appUrl(portalPath);

  useEffect(() => {
    setRegisterHref(buildFoundingSignupHref());
  }, []);

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

  const handleRegisterClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    source: "founding_banner_click" | "nav_register_click"
  ) => {
    trackEvent(source, { location: "landing_header" });
    // Same-page: open modal without full navigation.
    if (
      window.location.pathname === "/" ||
      window.location.pathname === "" ||
      window.location.pathname === "/landing"
    ) {
      e.preventDefault();
      const href = buildFoundingSignupHref();
      window.history.replaceState({}, "", href);
      requestFoundingSignupOpen();
      closeMenu();
    }
  };

  const announceCtaLabel = useMemo(
    () => `${stickyAnnouncement.cta} →`,
    []
  );

  return (
    <>
      <header
        className={`landing-header sticky-top${scrolled ? " is-scrolled" : ""}`}
        id="landing-header"
      >
        <div className="fm-announce" role="region" aria-label="Founding Merchant Program">
          <p className="fm-announce-text">
            <span className="fm-announce-full">{stickyAnnouncement.full}</span>
            <span className="fm-announce-short">{stickyAnnouncement.short}</span>
          </p>
          <a
            href={registerHref}
            className="fm-announce-cta"
            aria-label={stickyAnnouncement.ctaAriaLabel}
            onClick={(e) => handleRegisterClick(e, "founding_banner_click")}
          >
            {announceCtaLabel}
          </a>
        </div>

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

            <p className="nav-positioning" aria-hidden="false">
              {navPositioningLine}
            </p>

            <div className="nav-top-actions">
              <a
                href={demoHref}
                className="btn btn-ghost nav-demo-btn"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("hero_demo_click", { location: "nav" })}
              >
                {navDemoCta}
              </a>
              <a
                href={registerHref}
                className="btn btn-gold nav-register-btn"
                onClick={(e) => handleRegisterClick(e, "nav_register_click")}
              >
                {navRegisterCta} <span className="arrow">→</span>
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
            href={registerHref}
            className="btn btn-gold"
            onClick={(e) => handleRegisterClick(e, "nav_register_click")}
          >
            {navRegisterCta} <span className="arrow">→</span>
          </a>
          <a
            href={demoHref}
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent("hero_demo_click", { location: "nav_drawer" });
              closeMenu();
            }}
          >
            {navDemoCta} <span className="arrow">→</span>
          </a>
          <a href={portalHref} className="btn btn-ghost" onClick={closeMenu}>
            Portal <span className="arrow">→</span>
          </a>
          <ContactLink className="btn btn-ghost" onClick={closeMenu}>
            Contact <span className="arrow">→</span>
          </ContactLink>
        </div>
      </aside>
    </>
  );
}
