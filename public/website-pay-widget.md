# Website Pay Widget — Integration Guide

Step-by-step guide to embed the SlicePay crypto payment gateway on any website.

**Last updated:** 2026-07-29  
**Author:** SlicePay Developer Relations

## Overview

SlicePay uses a **hosted checkout** pattern (similar to Stripe Checkout redirect). Your website passes the cart total, order reference, and optional description to pay.slicechain.io. The customer completes payment in a secure hosted flow; funds settle to your linked merchant wallet in USDC.

- Checkout host: https://pay.slicechain.io
- Embed script: https://pay.slicechain.io/embed.js
- Gateway API: https://api.slicechain.io/api/gateway
- No iframe required — popup or full-page redirect

## Before you start

- A SlicePay business account with a linked Solana wallet (Business dashboard → Settings)
- Your merchant ID (MongoDB business `_id` from the dashboard or API)
- HTTPS on your production store (recommended for checkout popups)
- Optional: `apiKey` from Business settings for server-side invoice creation

## Option A — Embed script (minimal, no backend)

Add one script tag to your checkout or cart page. Replace `YOUR_MERCHANT_ID` with your business ID.

```html
<script src="https://pay.slicechain.io/embed.js"
  data-merchant-id="YOUR_MERCHANT_ID"
  data-amount="49.99"
  data-order-id="ORD-12345"
  data-description="2x Large Pepperoni"
  data-redirect="https://yourstore.com/thanks"
  data-popup="true"></script>
```

## Dynamic amount from your checkout page

```javascript
document.getElementById('pay-crypto').onclick = () => {
  const amount = document.getElementById('cart-total').value;
  const orderId = 'ORD-' + Date.now();
  const url = new URL('https://pay.slicechain.io/');
  url.searchParams.set('merchantId', 'YOUR_MERCHANT_ID');
  url.searchParams.set('amount', amount);
  url.searchParams.set('orderId', orderId);
  url.searchParams.set('description', 'Order from My Store');
  url.searchParams.set('redirect', 'https://yourstore.com/thanks?order=' + orderId);
  window.open(url.toString(), 'slicepay', 'width=480,height=820');
};
```

## Option B — Direct hosted URL

```
https://pay.slicechain.io/?merchantId=YOUR_MERCHANT_ID&amount=49.99&orderId=ORD-12345&description=Order+note&redirect=https://yourstore.com/thanks
```

## Option C — Server-side invoice (recommended for production)

Create the invoice on your server so the amount cannot be tampered with in the browser.

```json
POST https://api.slicechain.io/api/gateway/create-invoice
{
  "merchantId": "YOUR_MERCHANT_ID",
  "amountUsd": 49.99,
  "orderId": "ORD-12345",
  "description": "Cart checkout",
  "redirectUrl": "https://yourstore.com/thanks",
  "apiKey": "optional-business-api-key"
}
```

Redirect customer to: `https://pay.slicechain.io/?invoiceId=PUBLIC_INVOICE_ID`

## Parameters reference

- **merchantId** — required; your SlicePay business ID
- **amount / amountUsd** — checkout total in USD (min $0.01)
- **orderId** — your order reference (1–128 characters)
- **description** — optional note shown on receipt (max 500 characters)
- **redirect / redirectUrl** — where the customer returns after paying
- **invoiceId** — load an existing server-created invoice instead of URL params

## Payment confirmation on your site

After a successful payment, SlicePay checkout sends a postMessage to the page that opened the popup:

```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type !== 'slicepay:paid') return;
  // Validate event.origin in production (https://pay.slicechain.io)
  console.log(event.data.orderId, event.data.txSignature, event.data.invoiceId);
});
```

- Return URL includes: `?orderId=…&status=paid&tx=…&invoiceId=…`
- Poll `GET /api/gateway/payment-status/:invoiceId` from your server for authoritative status
- Invoices expire after 30 minutes

## Testing

- Mock merchant store: https://pay.slicechain.io/test-embed.html
- Business dashboard → Online Payment Gateway → Test SlicePay checkout
- Use a mainnet USDC wallet for a live end-to-end payment test

## Support

Questions about integration? Email slicepay@slicechain.io or open the business dashboard for gateway test tools.

## Related discovery

- OpenAPI: https://slicechain.io/.well-known/openapi/gateway.json
- API catalog: https://slicechain.io/.well-known/api-catalog
- Authentication: https://slicechain.io/auth.md
