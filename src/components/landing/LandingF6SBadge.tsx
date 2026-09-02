import { f6sAward } from "@/content/landing-content";

export function LandingF6SBadge() {
  return (
    <section className="fm-f6s-badge" aria-label="F6S startup ranking">
      <div className="wrap fm-f6s-badge-inner" data-reveal>
        <a
          href={f6sAward.href}
          target="_blank"
          rel="noopener noreferrer"
          title="View SliceChain Holdings on F6S"
        >
          <img
            src={f6sAward.image}
            alt={f6sAward.alt}
            width={380}
            height={120}
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>
    </section>
  );
}
