import { supportedChainLogos } from "@/content/landing-content";

export function ChainLogoCarousel() {
  const items = [...supportedChainLogos, ...supportedChainLogos];

  return (
    <div className="chain-carousel" aria-label="Supported blockchain networks">
      <div className="chain-track">
        {items.map((chain, i) => (
          <div key={`${chain.name}-${i}`} className="chain-logo-item" title={chain.name} aria-hidden={i >= supportedChainLogos.length}>
            <img
              src={chain.logo}
              alt={i < supportedChainLogos.length ? `${chain.name} - multi-chain crypto payments on SlicePay` : ""}
              loading="lazy"
              decoding="async"
              width={48}
              height={48}
            />
            <span className="chain-logo-name">{chain.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
