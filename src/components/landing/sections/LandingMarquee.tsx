import { marqueeItems } from "@/content/landing-content";

export function LandingMarquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee">
      <div className="track" aria-hidden="true">
        {items.map((text, i) => (
          <span key={i}>
            {text}
            <span className="dot"></span>
          </span>
        ))}
      </div>
    </div>
  );
}
