export const payWidgetPath = "/website-pay-widget/";

export const payWidgetSection = {
  subtitle: "Website Pay Widget",
  titleHtml: 'Add crypto checkout to <span class="it">any website</span>',
  lede:
    "SlicePay's hosted payment gateway lets e-commerce stores, SaaS billing pages, and custom checkout flows accept USDC and multi-chain crypto with one script tag or a server-created invoice — no iframe, no wallet SDK, and no blockchain code on your site.",
  cta: { label: "Integration guide", href: payWidgetPath },
  features: [
    {
      n: "01",
      t: "One-line embed",
      d: "Add embed.js with merchant ID, amount, order ID, and optional description. Opens hosted checkout in a popup or same tab.",
      tag: "Live",
    },
    {
      n: "02",
      t: "Server-side invoices",
      d: "Create invoices from your backend so cart totals are authoritative, then redirect customers to pay.slicechain.io.",
      tag: "Live",
    },
    {
      n: "03",
      t: "Payment confirmation",
      d: "Checkout notifies your page via postMessage and appends status, tx hash, and order ID to your return URL.",
      tag: "Live",
    },
    {
      n: "04",
      t: "Multi-chain checkout",
      d: "Customers pay with USDC on Solana or swap from ETH, SOL, and other supported chains at checkout.",
      tag: "Live",
    },
  ],
  checkoutUrl: "https://pay.slicechain.io",
  embedUrl: "https://pay.slicechain.io/embed.js",
  testPageUrl: "https://pay.slicechain.io/test-embed.html",
};

export type GuideSection = {
  id: string;
  heading: string;
  body?: string;
  bullets?: string[];
  code?: string;
  codeLang?: string;
};

export const payWidgetGuide = {
  title: "Website Pay Widget — Integration Guide",
  lastUpdated: "2026-07-29",
  author: "SlicePay Developer Relations",
  description:
    "Step-by-step guide to embed the SlicePay crypto payment gateway on any website: script tag, hosted checkout URL, server-side invoices, postMessage confirmation, and testing.",
  sections: [
    {
      id: "overview",
      heading: "Overview",
      body:
        "SlicePay uses a **hosted checkout** pattern (similar to Stripe Checkout redirect). Your website passes the cart total, order reference, and optional description to pay.slicechain.io. The customer completes payment in a secure hosted flow; funds settle to your linked merchant wallet in USDC.",
      bullets: [
        "Checkout host: https://pay.slicechain.io",
        "Embed script: https://pay.slicechain.io/embed.js",
        "Gateway API: https://api.slicechain.io/api/gateway",
        "No iframe required — popup or full-page redirect",
      ],
    },
    {
      id: "requirements",
      heading: "Before you start",
      bullets: [
        "A SlicePay business account with a linked Solana wallet (Business dashboard → Settings)",
        "Your merchant ID (MongoDB business `_id` from the dashboard or API)",
        "HTTPS on your production store (recommended for checkout popups)",
        "Optional: `apiKey` from Business settings for server-side invoice creation",
      ],
    },
    {
      id: "embed",
      heading: "Option A — Embed script (minimal, no backend)",
      body:
        "Add one script tag to your checkout or cart page. Replace `YOUR_MERCHANT_ID` with your business ID. Static amounts work for fixed-price products; use JavaScript for dynamic cart totals (see below).",
      code: `<script src="https://pay.slicechain.io/embed.js"
  data-merchant-id="YOUR_MERCHANT_ID"
  data-amount="49.99"
  data-order-id="ORD-12345"
  data-description="2x Large Pepperoni"
  data-redirect="https://yourstore.com/thanks"
  data-popup="true"></script>`,
      codeLang: "html",
    },
    {
      id: "dynamic",
      heading: "Dynamic amount from your checkout page",
      body:
        "Read the cart total from your page state and open hosted checkout when the customer clicks Pay with Crypto:",
      code: `document.getElementById('pay-crypto').onclick = () => {
  const amount = document.getElementById('cart-total').value;
  const orderId = 'ORD-' + Date.now();
  const url = new URL('https://pay.slicechain.io/');
  url.searchParams.set('merchantId', 'YOUR_MERCHANT_ID');
  url.searchParams.set('amount', amount);
  url.searchParams.set('orderId', orderId);
  url.searchParams.set('description', 'Order from My Store');
  url.searchParams.set('redirect', 'https://yourstore.com/thanks?order=' + orderId);
  window.open(url.toString(), 'slicepay', 'width=480,height=820');
};`,
      codeLang: "javascript",
    },
    {
      id: "hosted-url",
      heading: "Option B — Direct hosted URL",
      body: "Link or redirect customers to:",
      code: `https://pay.slicechain.io/?merchantId=YOUR_MERCHANT_ID&amount=49.99&orderId=ORD-12345&description=Order+note&redirect=https://yourstore.com/thanks`,
      codeLang: "text",
    },
    {
      id: "server-invoice",
      heading: "Option C — Server-side invoice (recommended for production)",
      body:
        "Create the invoice on your server so the amount cannot be tampered with in the browser. Then redirect the customer to the returned `invoiceId`.",
      code: `// POST https://api.slicechain.io/api/gateway/create-invoice
{
  "merchantId": "YOUR_MERCHANT_ID",
  "amountUsd": 49.99,
  "orderId": "ORD-12345",
  "description": "Cart checkout",
  "redirectUrl": "https://yourstore.com/thanks",
  "apiKey": "optional-business-api-key"
}

// Redirect customer to:
// https://pay.slicechain.io/?invoiceId=PUBLIC_INVOICE_ID`,
      codeLang: "json",
    },
    {
      id: "parameters",
      heading: "Parameters reference",
      bullets: [
        "merchantId — required; your SlicePay business ID",
        "amount / amountUsd — checkout total in USD (min $0.01)",
        "orderId — your order reference (1–128 characters)",
        "description — optional note shown on receipt (max 500 characters)",
        "redirect / redirectUrl — where the customer returns after paying",
        "invoiceId — load an existing server-created invoice instead of URL params",
      ],
    },
    {
      id: "confirmation",
      heading: "Payment confirmation on your site",
      body:
        "After a successful payment, SlicePay checkout sends a postMessage to the page that opened the popup:",
      code: `window.addEventListener('message', (event) => {
  if (event.data?.type !== 'slicepay:paid') return;
  // Validate event.origin in production (https://pay.slicechain.io)
  console.log(event.data.orderId, event.data.txSignature, event.data.invoiceId);
});`,
      codeLang: "javascript",
      bullets: [
        "Return URL includes: ?orderId=…&status=paid&tx=…&invoiceId=…",
        "Poll GET /api/gateway/payment-status/:invoiceId from your server for authoritative status",
        "Invoices expire after 30 minutes",
      ],
    },
    {
      id: "testing",
      heading: "Testing",
      bullets: [
        "Mock merchant store: https://pay.slicechain.io/test-embed.html",
        "Business dashboard → Online Payment Gateway → Test SlicePay checkout",
        "Automated smoke test (self-hosted): node scripts/gateway-smoke-test.js in the platform repo",
        "Use a mainnet USDC wallet for a live end-to-end payment test",
      ],
    },
    {
      id: "support",
      heading: "Support",
      body:
        "Questions about integration? Email slicepay@slicechain.io or open the business dashboard for gateway test tools.",
    },
  ] satisfies GuideSection[],
};
