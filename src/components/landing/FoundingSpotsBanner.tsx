"use client";

interface FoundingSpotsBannerProps {
  remainingSpots: number;
  maxSpots: number;
  claimedSpots: number;
}

export function FoundingSpotsBanner({ remainingSpots, maxSpots, claimedSpots }: FoundingSpotsBannerProps) {
  return (
    <div className="fm-spots-banner" aria-live="polite">
      <div className="fm-spots-banner-inner">
        <span className="fm-spots-label mono">Founding merchant spots</span>
        <div className="fm-spots-count display">
          <strong>{remainingSpots}</strong>
          <span className="fm-spots-of">of {maxSpots}</span>
        </div>
        <p className="fm-spots-caption">
          {remainingSpots === 0
            ? "All founding merchant spots have been claimed."
            : `${claimedSpots} spot${claimedSpots === 1 ? "" : "s"} claimed · confirm your email to secure yours`}
        </p>
      </div>
    </div>
  );
}
