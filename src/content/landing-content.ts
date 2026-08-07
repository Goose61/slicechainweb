const A = "/landing-assets/images";
const V = "/landing-assets/videos";

/** 60-second product demo shown in the founding merchant hero modal. */
export const demoVideoPath = `${V}/slicepay-demo.mp4`;

/** Platform login / signup entry (not the marketing home). */
export const portalPath = "/portal/";
export const businessDemoPath = "/business/demo/";
export const businessLoginPath = "/business/login/";
/** Founding merchant application (opens landing modal). */
export const businessSignupPath = "/?founding-signup=1#founding-merchant";
export const employeeLoginPath = "/employee/login/";
/** Static legal pages - trailing slash avoids GitHub Pages 301 redirects. */
export const termsPath = "/terms/";
export const privacyPath = "/privacy/";
/** Website Pay Widget integration guide */
export const payWidgetGuidePath = "/website-pay-widget/";
export const contactPath = "/contact/";

export const stickyAnnouncement = {
  full: "Founding Merchant Program - limited to the first 500 businesses · 50% off platform fees for life",
  short: "Founding Merchant Program · First 500",
  cta: "Claim Founding Benefits",
  ctaAriaLabel: "Claim Founding Merchant benefits",
};

export const navPositioningLine =
  "SlicePay® by SliceChain Holdings - Building the Merchant Operating Layer for Programmable Commerce";

export const navCaseStudiesCta = "Case Studies";
export const caseStudiesPath = "/case-studies/";

export const navRegisterCta = "Register Now";
export const navDemoCta = "Try Demo";

export const landingMeta = {
  title: "SlicePay | Global Crypto Payments Provider & Processor",
  description:
    "SlicePay is a global crypto payments provider and processor. In-store QR checkout, physical POS facilitation, and website pay widget - transparent pricing and USDC settlement.",
};

/** Keyword-rich hero intro (~100 words) - primary on-page content below H1. */
export const heroLead =
  "Slice Chain powers SlicePay (Slice Pay), a global crypto payments provider and processor for merchants worldwide. Our infrastructure handles in-store QR checkout, physical POS facilitation, and online checkout gateway rails - with USDC settlement, multi-chain support, and transparent 1.9% pricing. Whether you run restaurants, retail, e-commerce, or field service, SlicePay gives you one platform to accept crypto payments, pay staff fairly, and keep more margin on every sale.";

/** Compact hero callout - links to Website Pay Widget (section 07). */
export const heroOnlineGateway = {
  eyebrow: "New · Online checkout",
  title: "Crypto e-commerce gateway",
  body: "Add hosted checkout to any website - grow globally, cut margins, and accept crypto payments without blockchain code.",
  cta: "Website Pay Widget",
  href: "#pay-widget",
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
    "Multi-chain crypto payments diagram showing SlicePay blockchain payment processor supporting QR code crypto payments and USDC payments for business",
  stablecoins: "USDC & USDT on all compliant chains",
  footer: "Multi chain payments with one compliance layer. Multiple chains. Unlimited possibilities.",
};

export const brandName = "SlicePay";
export const brandMark = "SlicePay®";
export const logo = `${A}/pizza/pizzaimages/main_logo.webp`;

export const social = {
  telegram: "https://t.me/+PrL-wbxrW39kODBk",
  twitter: "https://x.com/slice__pay",
  // Split into parts so the literal address never appears in the static HTML.
  // This stops Cloudflare Email Obfuscation from injecting email-decode.min.js
  // into the landing page's critical request chain. Assembled client-side by ContactLink.
  emailUser: "slicepay",
  emailDomain: "slicechain.io",
  email: "mailto:slicepay@slicechain.io",
  emailDisplay: "slicepay@slicechain.io",
};

export const foundingMerchantHeroImage = `${A}/slicepay-merchant-hero.webp`;

export const foundingMerchant = {
  eyebrow: "Founding merchant enrollment is open",
  titleHtml: 'Accept Crypto.<br>Keep More <span class="it">Revenue</span>.',
  subhead:
    "A global crypto payments provider and processor - in-store QR checkout, physical POS facilitation, and stablecoin settlement with transparent 1.9% pricing.",
  copy: "Built for merchants worldwide: restaurants, retailers, e-commerce stores, and service businesses that want faster payments, lower fees, and crypto-native checkout without replacing how they operate.",
  maxSpots: 500,
  benefits: [
    "Lifetime Founding Merchant Status",
    "50% off platform subscription fees for life",
    "Zero setup and onboarding fees",
    "Priority support access",
    "Early access to new features",
    "Founding Merchant Badge",
    "Product roadmap influence",
    "Preferred pricing on future SliceChain products",
  ],
  availabilityNote: "Limited availability: first 500 businesses only",
  updatesOptIn: "Also send me occasional SliceChain research and product updates.",
  cta: "Become a Founding Merchant",
  demoCta: "See the 60-Second Demo",
  useSlicePayCta: "Use SlicePay now",
  riskReducers: [
    "No setup or onboarding fee",
    "Priority support",
    "Limited to 500 businesses",
  ],
  trustCards: [
    { value: "1.9%", label: "Transparent SlicePay processing rate" },
    { value: "USDC", label: "Fast stablecoin settlement for merchants" },
    { value: "QR", label: "Simple checkout for in-person payments" },
  ],
  calculator: {
    eyebrow: "SlicePay Savings Estimate",
    title: "See what traditional payment fees may be costing you.",
    volumeLabel: "Monthly card volume",
    traditionalLabel: "Traditional processing",
    sliceLabel: "SlicePay",
    savingsLabel: "Estimated monthly savings",
    disclaimer:
      "Illustrative estimate. Actual savings vary by provider and transaction mix.",
  },
  merchantFit: [
    { title: "Restaurants", body: "Protect margins on dine-in, takeout, catering, and repeat customer volume." },
    { title: "Retailers", body: "Give crypto-ready customers a simple QR checkout while reducing card fee drag." },
    { title: "Food Trucks", body: "Accept fast in-person payments with lower fees and a lighter checkout flow." },
    { title: "Service Businesses", body: "Improve payment speed for appointments, invoices, deposits, and local services." },
  ],
};

export const navLinks = [
  { href: "#home", label: "Home", num: "01" },
  { href: "#mission", label: "Mission & Vision", num: "02" },
  { href: "#about", label: "About", num: "03" },
  { href: "#team", label: "Team", num: "04" },
  { href: "#marketing", label: "How It Works", num: "05" },
  { href: "#businesses", label: "For Businesses", num: "06" },
  { href: "#pay-widget", label: "Pay Widget", num: "07" },
  { href: "#gallery", label: "Gallery", num: "08" },
  { href: "#plan", label: "Roadmap", num: "09" },
  { href: "#community", label: "Get Started", num: "10" },
];

export const heroSlides = [
  {
    subtitle: "Global payment processing",
    titleHtml: 'Accept <span class="it">cryptocurrency</span><br>payments in USDC',
    text: "Crypto payment processing for in-store and online - QR checkout and hosted gateway let customers pay with crypto from any supported wallet.",
    cta: { label: "Open Portal", href: portalPath },
    bg: `${A}/hero-slider-1.jpg`,
    bgAlt: "Restaurant accepting QR code crypto payments with SlicePay crypto payment gateway",
  },
  {
    subtitle: "In-store & online",
    titleHtml: 'USDC payouts<br>for <span class="it">merchants</span>',
    text: "1.9% total fee with automatic USDC and USDT payouts - QR, POS, and website checkout on one processor.",
    bg: `${A}/hero-slider-2.jpg`,
    bgAlt: "Small business owner receiving USDC payments for business through SlicePay",
  },
  {
    subtitle: "Customers & staff win",
    titleHtml: 'Multi-chain crypto<br>payments <span class="it">made simple</span>',
    text: "Shoppers earn SLICE rewards. Employees earn 0.3% when they facilitate a blockchain payment.",
    bg: `${A}/hero-slider-3.jpg`,
    bgAlt: "Employee generating multi-chain crypto payments QR code at SlicePay checkout",
  },
];

export const heroStats = {
  left: { label: "Total business fee", value: "1.9%" },
  right: { label: "Employee commission", value: "0.3%" },
};

export const marqueeItems = [
  "SlicePay QR Payments",
  "Crypto Payments for Businesses",
  "Multi Chain Payments",
  "Pay with Any Wallet",
  "Cross-Chain Compliant",
  "USDC & USDT Supported",
  "SLICE Loyalty Rewards",
  "1.9% Business Fee",
  "Employee Commissions",
  "Website Pay Widget",
  "Global Payment Processing",
];

export const platformPillars = [
  {
    n: "I.",
    title: "Scan & Pay",
    body: "Customers scan your SlicePay QR code crypto payment and pay from any compatible wallet to accept cryptocurrency payments at checkout.",
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
  {
    n: "VI.",
    title: "Online checkout",
    body: "Add hosted crypto checkout to any website with one embed script or API-created invoice. No iframe, no wallet SDK, and no blockchain code on your store.",
  },
];

export const slicePaySection = {
  subtitle: "Payment Platform",
  title: "How Our Crypto Payment Processor Works",
  text: "SlicePay is global crypto payment infrastructure for in-person and online commerce. Customers scan a QR at the counter or checkout on your website; merchants receive USDC payouts across our multi-chain network. Shoppers earn SLICE loyalty tokens; staff earn 0.3% when they facilitate a sale.",
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
    cta: { label: "Register Now", href: businessSignupPath },
  },
];

export const mission = {
  subtitle: "Mission & Vision",
  title: "Why we built SlicePay",
  blocks: [
    {
      title: "Our mission",
      body: "Give merchants worldwide practical crypto payment processing - in-store, on the go, and online - with loyalty built in and fair staff payouts from every sale.",
    },
    {
      title: "Our vision",
      body: "Become the trusted global layer for crypto checkout: QR and POS in the field, hosted gateway for e-commerce, and cross-chain stablecoin settlement at scale.",
    },
  ],
};

export const aboutSlicePay = {
  subtitle: "About SlicePay",
  title: "Built for businesses that want to move faster.",
  text: "We created SlicePay - the Slice Chain flagship crypto payments processor from SliceChain Holdings - to help merchants accept cryptocurrency worldwide: QR and POS in person, hosted checkout online, and USDC settlement without replacing existing workflows.",
  banner: `${A}/about-banner.webp`,
  bannerAlt: "Merchants using SlicePay crypto payment gateway to accept cryptocurrency payments at checkout",
};

export const team = {
  subtitle: "Leadership",
  tagline: "Driven by People. Built for Progress",
  members: [
    {
      name: "Aseem Bhardwaj",
      role: "Founder & CEO",
      photo: `${A}/ab-headshot.jpg`,
      photoPosition: "center center",
      linkedin: "https://www.linkedin.com/in/aseemmba",
    },
    {
      name: "Gustav Eigenhuis",
      role: "Co-Founder & CTO",
      photo: `${A}/gustav-headshot.jpg`,
      photoPosition: "center center",
      linkedin: "https://www.linkedin.com/in/gustav-eigenhuis",
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

/** Campaign gallery - images in public/landing-assets/images/ */
export const galleryImages = [
  { src: `${A}/bft.jpg`, alt: "BFT enters SlicePay - signed strategic partnership for payment utility and merchant rails" },
  { src: `${A}/blockfest1.jpg`, alt: "SlicePay at Blockfest Africa Roadshow - Cape Town 2026" },
  { src: `${A}/blockfest2.jpg`, alt: "SlicePay speaking at Blockfest Africa on crypto payments and merchant enablement" },
  { src: `${A}/steve.jpg`, alt: "SliceChain team representing SlicePay at a live merchant event" },
  { src: `${A}/xeus.jpg`, alt: "SlicePay community at Blockfest Africa - Web3 payments in the field" },
  { src: `${A}/stablecon.jpg`, alt: "SlicePay at Stablecon Salons Africa Series 2026" },
  { src: `${A}/pizza/campaign-gallery/photo_2026-07-30_22-02-38.jpg`, alt: "SliceChain at Startup Club ZA" },
];

export const communityCards = [
  { href: businessSignupPath, img: `${A}/event-1.jpg`, subtitle: "Business", title: "Register your business on SlicePay" },
  { href: employeeLoginPath, img: `${A}/event-2.jpg`, subtitle: "Employee", title: "Staff: generate QR codes and earn commission" },
  {
    href: businessSignupPath,
    img: `${A}/photo_2025-08-05_18-45-59.jpg`,
    subtitle: "Payments",
    title: "Start accepting wallet payments today",
  },
  { href: businessLoginPath, img: `${A}/photo_2025-08-05_18-45-58.jpg`, subtitle: "Dashboard", title: "Open your business dashboard" },
];

export const businesses = {
  titleHtml: 'Accept payments with <span class="it">SlicePay®</span><br>Keep more <span class="it">margin</span>',
  lede: "SlicePay is global crypto payment processing for restaurants, retailers, e-commerce, and field merchants. Accept wallet payments in-store or online while you receive USDC settlement with transparent 1.9% pricing and optional employee commissions.",
  cta: { label: "Register on SlicePay", href: businessSignupPath },
  rows: [
    { n: "01", t: "Multi chain payments", d: "Ethereum, Solana, Polygon, Base, Arbitrum, and more. Customers scan your QR and pay with crypto from any supported wallet.", tag: "Live" },
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
      items: ["Leading global crypto checkout", "Loyalty across categories", "Frictionless staff payouts", "Global merchant map"],
    },
  ],
};

export const footer = {
  address: "SlicePay® · Global crypto payments provider & processor",
  copyright: "© 2025 SliceChain Holdings Inc. All rights reserved.",
};
