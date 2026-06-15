import { appUrl } from "@/lib/appUrl";

const A = "/landing-assets/images";

/** Platform login / signup entry — live demo at app.slicechain.io from GitHub Pages. */
export const portalPath = appUrl("/portal");
export const businessDemoPath = appUrl("/business/demo");
export const businessLoginPath = appUrl("/business/login");
export const businessSignupPath = appUrl("/business/signup");
export const employeeLoginPath = appUrl("/employee/login");

export const landingMeta = {
  title: "SlicePay | Crypto Payment Gateway for Small Business",
  description:
    "SlicePay is a crypto payment gateway for restaurants and retailers. Accept cryptocurrency payments via QR codes, USDC payments for business, and multi-chain settlement.",
};

/** Keyword-rich hero intro (~100 words) — primary on-page content below H1. */
export const heroLead =
  "SlicePay is a crypto payment gateway built for small and medium businesses that need to accept cryptocurrency payments at checkout. Our blockchain payment processor powers QR code crypto payments from any compatible wallet, with USDC payments for business and employee payouts on every sale. Whether you need multi-chain crypto payments across Ethereum, Solana, Polygon, Base, and more, SlicePay gives you one simple flow to accept crypto with transparent 1.9% pricing, SLICE loyalty rewards, and stablecoin settlement in USDC and USDT.";

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
    subtitle: "Crypto payment gateway",
    titleHtml: 'Accept <span class="it">cryptocurrency</span><br>payments in USDC',
    text: "QR code crypto payments for restaurants and retailers — accept crypto from any supported wallet.",
    cta: { label: "Open Portal", href: portalPath },
    bg: `${A}/hero-slider-1.jpg`,
    bgAlt: "Restaurant accepting QR code crypto payments with SlicePay crypto payment gateway",
  },
  {
    subtitle: "Built for Main Street",
    titleHtml: 'USDC payouts<br>for <span class="it">businesses</span>',
    text: "1.9% total fee with automatic USDC and USDT payouts for owners and staff.",
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
];

export const slicePaySection = {
  subtitle: "Payment Platform",
  title: "How Our Crypto Payment Gateway Works",
  text: "SlicePay is a blockchain payment processor built for small and medium businesses that want to accept cryptocurrency payments without complexity. Customers scan a QR code crypto payment at checkout and pay from any compatible wallet across our multi-chain crypto payments network. USDC payments for business and employee commissions settle in USDC and USDT on supported chains. Shoppers earn SLICE loyalty tokens; staff earn 0.3% when they facilitate a sale.",
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
      body: "Give small and medium businesses a practical crypto payment gateway to accept cryptocurrency payments, reward repeat customers with SLICE, and pay staff fairly from every QR code crypto sale.",
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
  text: "We created SlicePay — SliceChain Holdings flagship blockchain payment processor — to help merchants accept cryptocurrency payments, run QR code crypto checkout, and receive USDC payments for business without replacing existing workflows.",
  banner: `${A}/about-banner.jpg`,
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
  { src: `${A}/pizza/campaign-gallery/photo_1_2025-08-01_12-08-13.jpg`, alt: "Customer using QR code crypto payments at a SlicePay merchant partner" },
  { src: `${A}/pizza/campaign-gallery/photo_2_2025-08-01_12-08-13.jpg`, alt: "Merchant onboarding to accept cryptocurrency payments with SlicePay" },
  { src: `${A}/pizza/campaign-gallery/photo_5_2025-08-01_12-08-13.jpg`, alt: "New SlicePay location celebrating USDC payments for business" },
  { src: `${A}/pizza/campaign-gallery/photo_6_2025-08-01_12-08-13.jpg`, alt: "Community event promoting multi-chain crypto payments with SlicePay" },
  { src: `${A}/pizza/campaign-gallery/image-11.jpg`, alt: "SlicePay crypto payment gateway campaign at a local business" },
];

export const communityCards = [
  { href: portalPath, img: `${A}/event-1.jpg`, alt: "Business owner registering to accept cryptocurrency payments on SlicePay", subtitle: "Business", title: "Register your business on SlicePay" },
  { href: employeeLoginPath, img: `${A}/event-2.jpg`, alt: "Employee generating QR code crypto payments for USDC checkout", subtitle: "Employee", title: "Staff: generate QR codes and earn commission" },
  {
    href: portalPath,
    img: `${A}/photo_2025-08-05_18-45-59.jpg`,
    alt: "Customer completing multi-chain crypto payments with SlicePay blockchain payment processor",
    subtitle: "Payments",
    title: "Start accepting wallet payments today",
  },
  { href: businessLoginPath, img: `${A}/photo_2025-08-05_18-45-58.jpg`, alt: "SlicePay business dashboard for USDC payments and crypto payment analytics", subtitle: "Dashboard", title: "Open your business dashboard" },
];

export const businesses = {
  titleHtml: 'Accept payments with <span class="it">SlicePay</span><br>Keep more <span class="it">margin</span>',
  lede: "SlicePay is the crypto payment gateway built for restaurants, food trucks, and retailers. Let customers accept cryptocurrency payments from any wallet on supported chains while you receive USDC payments for business with a simple 1.9% total fee and QR code crypto payments at the counter.",
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
