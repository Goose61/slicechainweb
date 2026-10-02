"use client";

import { useEffect } from "react";

function getStickyHeaderOffset() {
  const header = document.getElementById("landing-header");
  return (header?.offsetHeight ?? 0) + 12;
}

function revealLandingLayout(root: Element) {
  root.querySelectorAll("section, .crew, .foot").forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.contentVisibility = "visible";
    }
  });
}

function scrollToSection(root: Element, target: HTMLElement) {
  revealLandingLayout(root);
  // Read layout after skipped sections have a real height.
  void target.offsetHeight;

  const offset = getStickyHeaderOffset();
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
}

function sectionIdFromHref(href: string) {
  if (!href.startsWith("#") || href === "#") return "";
  try {
    return decodeURIComponent(href.slice(1));
  } catch {
    return "";
  }
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
      const targetEl = e.target;
      if (!(targetEl instanceof Element)) return;
      const a = targetEl.closest('a[href^="#"]');
      if (!a || !root.contains(a)) return;
      const id = sectionIdFromHref(a.getAttribute("href") || "");
      if (!id) return;
      const target = document.getElementById(id);
      if (!(target instanceof HTMLElement) || !root.contains(target)) return;
      e.preventDefault();
      scrollToSection(root, target);
      window.history.replaceState(null, "", `#${id}`);
    };

    root.addEventListener("click", onAnchorClick);

    const scrollToHash = () => {
      const id = sectionIdFromHref(window.location.hash);
      if (!id) return;
      const target = document.getElementById(id);
      if (target instanceof HTMLElement && root.contains(target)) {
        requestAnimationFrame(() => scrollToSection(root, target));
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
      root.removeEventListener("click", onAnchorClick);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);
}
