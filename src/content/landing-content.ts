const A = "/landing-assets/images";

/** Platform login / signup entry (not the marketing home). */
export const portalPath = "/portal";

export const landingMeta = {
  title: "SlicePay · Crypto Payments for Small Business",
  description:
    "SlicePay is an alternative payment provider for small and medium businesses. Accept crypto from any wallet across supported chains, reward customers with SLICE, and settle in USDC and USDT.",
};

export const supportedChainLogos = [
  { name: "Ethereum", logo: `${A}/chains/ethereum.png` },
  { name: "Solana", logo: `${A}/chains/solana.png` },
  { name: "Monad", logo: `${A}/chains/monad.png` },
  { name: "Stellar", logo: `${A}/chains/stellar.png` },
  { name: "Polygon", logo: `${A}/chains/polygon.png` },
  { name: "Avalanche", logo: `${A}/chains/avalanche.png` },
  { name: "Arbitrum", logo: `${A}/chains/arbitrum.png` },
  { name: "Base", logo: `${A}/chains/base.png` },
  { name: "Optimism", logo: `${A}/chains/optimism.png` },
  { name: "HyperEVM", logo: `${A}/chains/hyperevm.png` },
  { name: "BNB Chain", logo: `${A}/chains/bnb.png` },
  { name: "Linea", logo: `${A}/chains/linea.png` },
];

/** @deprecated Use supportedChainLogos */
export const supportedChains = supportedChainLogos.map((c) => c.name);

export const crossChain = {
  subtitle: "Cross-chain",
  title: "Cross-chain compliant",
  tagline: "Seamless. Secure. Compliant. Everywhere.",
  image: `${A}/multi-chain.jpg`,
  imageAlt:
    "SlicePay cross-chain compliance supporting Ethereum, Solana, Monad, Stellar, Polygon, Avalanche, Arbitrum, Base, Optimism, HyperEVM, BNB Chain, and Linea with USDC and USDT",
  stablecoins: "USDC & USDT on all compliant chains",
  footer: "One compliance layer. Multiple chains. Unlimited possibilities.",
};

export const brandName = "SlicePay";
export const logo = `${A}/pizza/pizzaimages/main_logo.png`;

export const social = {
  telegram: "https://t.me/+PrL-wbxrW39kODBk",
  twitter: "https://x.com/slice__pay",
  email: "mailto:slicepay@pizzabit.io",
  emailDisplay: "slicepay@pizzabit.io",
};

export const navLinks = [
  { href: "#home", label: "Home", num: "01" },
  { href: "#mission", label: "Mission & Vision", num: "02" },
  { href: "#about", label: "About", num: "03" },
  { href: "#team", label: "Team", num: "04" },
  { href: "#marketing", label: "How It Works", num: "05" },
  { href: "#businesses", label: "For Businesses", num: "06" },
  { href: "#gallery", label: "Gallery", num: "07" },
  { href: "#plan", label: "Roadmap", num: "08" },
  { href: "#community", label: "Get Started", num: "09" },
];

export const heroSlides = [
  {
    subtitle: "Alternative payments",
    titleHtml: 'Pay with <span class="it">any wallet</span>,<br>get paid in USDC',
    text: "SlicePay helps restaurants and retailers accept crypto at checkout with a simple QR code.",
    cta: { label: "Open Portal", href: portalPath },
    bg: `${A}/hero-slider-1.jpg`,
  },
  {
    subtitle: "Built for Main Street",
    titleHtml: 'Lower fees,<span class="it"> real</span><br>loyalty rewards',
    text: "1.9% total fee with automatic stablecoin payouts for owners and staff.",
    bg: `${A}/hero-slider-2.jpg`,
  },
  {
    subtitle: "Customers & staff win",
    titleHtml: 'SLICE rewards<br>on every <span class="it">sale</span>',
    text: "Shoppers earn SLICE for future discounts. Employees earn 0.3% when they facilitate a payment.",
    bg: `${A}/hero-slider-3.jpg`,
  },
];

export const heroStats = {
  left: { label: "Total business fee", value: "1.9%" },
  right: { label: "Employee commission", value: "0.3%" },
};

export const marqueeItems = [
  "SlicePay QR Payments",
  "Pay with Any Wallet",
  "Cross-Chain Compliant",
  "USDC & USDT Supported",
  "SLICE Loyalty Rewards",
  "1.9% Business Fee",
  "Employee Commissions",
  "Built for SMB Retail",
];

export const platformPillars = [
  {
    n: "I.",
    title: "Scan & Pay",
    body: "Customers scan your SlicePay QR code and pay from any compatible wallet with supported coins.",
  },
  {
    n: "II.",
    title: "SLICE Loyalty",
    body: "Buyers receive SLICE tokens after each purchase and redeem them for discounts on future orders.",
  },
  {
    n: "III.",
    title: "Staff incentives",
    body: "Employees who facilitate a transaction earn 0.3% of the 1.9% platform fee, paid in supported stablecoins.",
  },
  {
    n: "IV.",
    title: "Owner payouts",
    body: "Business owners receive USDC and USDT payouts with transparent pricing and no hidden settlement delays.",
  },
  {
    n: "V.",
    title: "Multi-chain support",
    body: "Accept payments across Ethereum, Solana, Monad, Stellar, Polygon, Avalanche, Arbitrum, Base, Optimism, HyperEVM, BNB Chain, and Linea from a single QR flow.",
  },
];

export const slicePaySection = {
  subtitle: "Payment Platform",
  title: "Real Payments for Real Businesses",
  text: "SlicePay is an alternative payment provider built for small and medium businesses. Customers pay using any wallet with a QR code scanner across our supported cross-chain network. USDC and USDT are supported on all compliant chains. Customers receive SLICE loyalty tokens for discounts on future purchases. Employees who facilitate a transaction earn 0.3% of the 1.9% business fee. Both employees and business owners receive stablecoin payouts.",
  cta: { label: "Open SlicePay Portal", href: portalPath },
};

export const howSteps = [
  {
    step: "Step 01 · Pay",
    title: "Scan & Pay",
    body: "Customers scan a SlicePay QR code at checkout and pay from any compatible wallet with supported coins.",
    cta: { label: "For Businesses", href: "#businesses" },
  },
  {
    step: "Step 02 · Earn",
    title: "SLICE Rewards",
    body: "Customers receive SLICE loyalty tokens after each purchase and can use them for discounts on future orders.",
    cta: { label: "Learn More", href: "#mission" },
  },
  {
    step: "Step 03 · Payout",
    title: "Stablecoin payouts",
    body: "Business owners and facilitating employees receive USDC and USDT payouts across supported chains. Total business fee is 1.9%, with 0.3% going to the employee who processed the sale.",
    cta: { label: "Register Now", href: portalPath },
  },
];

export const mission = {
  subtitle: "Mission & Vision",
  title: "Why we built SlicePay",
  blocks: [
    {
      title: "Our mission",
      body: "Give small and medium businesses a practical way to accept crypto, reward repeat customers, and pay staff fairly from every sale.",
    },
    {
      title: "Our vision",
      body: "Become the trusted payment layer for food, retail, and service businesses that want flexible checkout, loyalty built in, and cross-chain stablecoin settlement.",
    },
  ],
};

export const aboutSlicePay = {
  subtitle: "About SlicePay",
  title: "Built for businesses that want to move faster.",
  text: "We created SlicePay — SliceChain Holdings flagship product to simplify how modern businesses manage payments, operations, and growth without adding complexity. Our platform helps companies deliver seamless customer experiences while keeping their existing workflows intact.",
  banner: `${A}/about-banner.jpg`,
};

export const team = {
  subtitle: "Leadership",
  tagline: "Driven by People. Built for Progress",
  members: [
    {
      name: "Aseem Bhardwaj",
      role: "Founder & CEO",
      photo: `${A}/ab-headshot.jpg`,
      photoPosition: "center top",
      linkedin: "https://www.linkedin.com/in/aseemmba",
    },
    {
      name: "Gustav Eigenhuis",
      role: "Co-Founder & CTO",
      photo: `${A}/gustav-headshot.jpg`,
      photoPosition: "center top",
      linkedin: "https://www.linkedin.com/in/gustav-eigenhuis-b28a712a9",
    },
  ],
};

export const partners = {
  subtitle: "Merchant Partners",
  title: "Businesses on SlicePay",
  text: "Restaurants and retailers using SlicePay to accept wallet payments and grow with SLICE loyalty.",
  items: [
    { href: "https://www.instagram.com/tastee_pizza1982/?hl=en", img: `${A}/pizza/partners/87223338_205483950838711_1360256017119576064_n.jpg`, alt: "Tastee Pizza" },
    { href: "https://m.facebook.com/JJs.Best.Pizza.Wyandotte/", img: `${A}/pizza/partners/492551658_1237382775056532_8825129307267605937_n.jpg`, alt: "JJ's Best Pizza" },
    { href: "https://haledonpizza.com/", img: `${A}/pizza/partners/logo.png`, alt: "Haledon Pizza" },
    { href: "https://www.rocknthegrill.com/", img: `${A}/pizza/partners/rocknthegrillh.png`, alt: "Rock'n The Grill" },
    { href: "https://www.dominos.com/", img: `${A}/pizza/partners/dominos_social_logo.jpg`, alt: "Domino's Pizza" },
  ],
};

export const maps = {
  subtitle: "Merchant network",
  title: "Find SlicePay locations",
  text: "Explore participating businesses on the map. Location stats update from our live merchant directory.",
  stats: [
    { label: "Locations", id: "total-locations" },
    { label: "Transactions", id: "total-transactions" },
    { label: "Active partners", id: "total-partners" },
  ],
};

export const gallery = {
  subtitle: "In the field",
  title: "SlicePay Gallery",
};

/** Add new gallery images here after placing files in public/landing-assets/images/pizza/campaign-gallery/ */
export const galleryImages = [
  { src: `${A}/pizza/campaign-gallery/photo_1_2025-08-01_12-08-13.jpg`, alt: "SlicePay checkout at a local partner" },
  { src: `${A}/pizza/campaign-gallery/photo_2_2025-08-01_12-08-13.jpg`, alt: "Merchant onboarding event" },
  { src: `${A}/pizza/campaign-gallery/photo_5_2025-08-01_12-08-13.jpg`, alt: "Celebrating a new SlicePay location" },
  { src: `${A}/pizza/campaign-gallery/photo_6_2025-08-01_12-08-13.jpg`, alt: "Community payment drive" },
  { src: `${A}/pizza/campaign-gallery/image-11.jpg`, alt: "SlicePay campaign highlight" },
];

export const communityCards = [
  { href: portalPath, img: `${A}/event-1.jpg`, subtitle: "Business", title: "Register your business on SlicePay" },
  { href: "/employee/login", img: `${A}/event-2.jpg`, subtitle: "Employee", title: "Staff: generate QR codes and earn commission" },
  {
    href: portalPath,
    img: `${A}/photo_2025-08-05_18-45-59.jpg`,
    subtitle: "Payments",
    title: "Start accepting wallet payments today",
  },
  { href: "/business/login", img: `${A}/photo_2025-08-05_18-45-58.jpg`, subtitle: "Dashboard", title: "Open your business dashboard" },
];

export const businesses = {
  titleHtml: 'Accept payments with <span class="it">SlicePay</span><br>Keep more <span class="it">margin</span>',
  lede: "SlicePay is built for restaurants, food trucks, and retailers. Let customers pay from any wallet on supported chains while you receive stablecoin payouts with a simple 1.9% total fee.",
  cta: { label: "Register on SlicePay", href: portalPath },
  rows: [
    { n: "01", t: "Cross-chain payments", d: "Ethereum, Solana, Polygon, Base, Arbitrum, and more. Customers scan your QR and pay from any supported wallet.", tag: "Live" },
    { n: "02", t: "SLICE Loyalty", d: "Customers earn SLICE tokens for discounts on future purchases at your business.", tag: "Live" },
    { n: "03", t: "1.9% Total Fee", d: "Simple pricing for businesses. 0.3% of the fee goes to the employee who facilitated the transaction.", tag: "Live" },
    { n: "04", t: "USDC & USDT payouts", d: "Business owners and employees receive stablecoin payouts on all compliant chains.", tag: "Live" },
    { n: "05", t: "Employee Commissions", d: "Staff who process payments earn automatically from each qualifying transaction.", tag: "Live" },
  ],
};

export const roadmap = {
  phases: [
    {
      state: "live",
      chap: "Chapter I",
      era: "Now",
      name: "SlicePay Launch",
      items: ["SlicePay QR payments live", "Business and employee portals", "SLICE loyalty rewards", "Partner merchant network"],
    },
    {
      state: "next",
      chap: "Chapter II",
      era: "Growing",
      name: "Network expansion",
      items: ["More merchant partners", "Expanded chain support", "Richer loyalty tooling", "Regional map growth"],
    },
    {
      state: "",
      chap: "Chapter III",
      era: "Future",
      name: "Platform depth",
      items: ["Deeper analytics", "More payout options", "Staff scheduling hooks", "Partner integrations"],
    },
    {
      state: "",
      chap: "Chapter IV",
      era: "Vision",
      name: "Everyday commerce",
      items: ["Leading SMB crypto checkout", "Loyalty across categories", "Frictionless staff payouts", "Global merchant map"],
    },
  ],
};

export const footer = {
  address: "SlicePay · Payments for growing businesses",
  copyright: "© 2025 SliceChain Holdings Inc. All rights reserved.",
};
