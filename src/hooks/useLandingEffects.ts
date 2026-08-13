"use client";

import { useEffect } from "react";

function getStickyHeaderOffset() {
  const header = document.getElementById("landing-header");
  return (header?.offsetHeight ?? 0) + 12;
}

function scrollToSection(target: Element) {
  if (target instanceof HTMLElement) {
    target.style.contentVisibility = "visible";
  }

  const offset = getStickyHeaderOffset();
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

export function useLandingEffects() {
  useEffect(() => {
    const root = document.querySelector("[data-landing-root]");
    if (!root) return;

    const revealObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const observeReveals = () => {
      root.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => revealObs.observe(el));
    };
    observeReveals();

    const revealMut = new MutationObserver(() => observeReveals());
    revealMut.observe(root, { childList: true, subtree: true });

    const headlines = root.querySelectorAll("#headline-slot .headline-slide");
    const dots = root.querySelectorAll("#h-dots button");
    let activeH = 0;

    function setHeadline(idx: number) {
      if (!headlines.length) return;
      headlines[activeH]?.classList.remove("active");
      dots[activeH]?.classList.remove("active");
      activeH = idx;
      headlines[activeH]?.classList.add("active");
      dots[activeH]?.classList.add("active");
    }

    dots.forEach((d) =>
      d.addEventListener("click", () => setHeadline(+(d as HTMLButtonElement).dataset.h!))
    );
    const cycle = setInterval(() => setHeadline((activeH + 1) % headlines.length), 5000);

    const headlineSlot = root.querySelector("#headline-slot");
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0]?.clientX ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0]?.clientX ?? 0;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) < 48 || !headlines.length) return;
      if (delta < 0) setHeadline((activeH + 1) % headlines.length);
      else setHeadline((activeH - 1 + headlines.length) % headlines.length);
    };
    headlineSlot?.addEventListener("touchstart", onTouchStart as EventListener, { passive: true });
    headlineSlot?.addEventListener("touchend", onTouchEnd as EventListener, { passive: true });

    const onAnchorClick = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = root.querySelector(href);
      if (!target) return;
      e.preventDefault();
      scrollToSection(target);
      window.history.replaceState(null, "", href);
    };

    const anchorLinks = root.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((a) => a.addEventListener("click", onAnchorClick));

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash || hash === "#") return;
      const target = root.querySelector(hash);
      if (target) {
        requestAnimationFrame(() => scrollToSection(target));
      }
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      revealObs.disconnect();
      revealMut.disconnect();
      clearInterval(cycle);
      headlineSlot?.removeEventListener("touchstart", onTouchStart as EventListener);
      headlineSlot?.removeEventListener("touchend", onTouchEnd as EventListener);
      anchorLinks.forEach((a) => a.removeEventListener("click", onAnchorClick));
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);
}
