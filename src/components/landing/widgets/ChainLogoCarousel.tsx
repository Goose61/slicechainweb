import { supportedChainLogos } from "@/content/landing-content";

export function ChainLogoCarousel() {
  const items = [...supportedChainLogos, ...supportedChainLogos];

  return (
    <div className="chain-carousel" aria-label="Supported blockchain networks">
      <div className="chain-track">
        {items.map((chain, i) => (
          <div key={`${chain.name}-${i}`} className="chain-logo-item" title={chain.name}>
            <img src={chain.logo} alt={`${chain.name} - multi-chain crypto payments on SlicePay`} loading="lazy" />
            <span className="chain-logo-name">{chain.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
