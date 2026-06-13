"use client";

import { useEffect } from "react";

export function useLandingEffects() {
  useEffect(() => {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const observeReveals = () => {
      document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => revealObs.observe(el));
    };
    observeReveals();

    const revealMut = new MutationObserver(() => observeReveals());
    revealMut.observe(document.body, { childList: true, subtree: true });
    const revealTimers = [400, 1200].map((ms) => setTimeout(observeReveals, ms));

    const headlines = document.querySelectorAll("#headline-slot .headline-slide");
    const dots = document.querySelectorAll("#h-dots button");
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

    const headlineSlot = document.getElementById("headline-slot");
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
    headlineSlot?.addEventListener("touchstart", onTouchStart, { passive: true });
    headlineSlot?.addEventListener("touchend", onTouchEnd, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const header = document.getElementById("landing-header");
          const offset = (header?.offsetHeight ?? 80) + 12;
          window.scrollTo({ top: (target as HTMLElement).offsetTop - offset, behavior: "smooth" });
        }
      });
    });

    return () => {
      revealObs.disconnect();
      revealMut.disconnect();
      revealTimers.forEach(clearTimeout);
      clearInterval(cycle);
      headlineSlot?.removeEventListener("touchstart", onTouchStart);
      headlineSlot?.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
}
