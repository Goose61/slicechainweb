# SlicePay Website Pay Widget

Embed crypto checkout on any website without blockchain code.

## When to use

Use this skill when integrating SlicePay into e-commerce stores, SaaS billing pages, or custom checkout flows.

## Integration options

### Option A - Embed script (no backend)

```html
<script src="https://pay.slicechain.io/embed.js"
  data-merchant-id="YOUR_MERCHANT_ID"
  data-amount="49.99"
  data-order-id="ORD-12345"
  data-description="Order note"
  data-redirect="https://yourstore.com/thanks"
  data-popup="true"></script>
```

### Option B - Hosted checkout URL

Redirect or link to:

`https://pay.slicechain.io/?merchantId=YOUR_MERCHANT_ID&amount=49.99&orderId=ORD-12345`

### Option C - Server-side invoice (recommended)

1. `POST https://api.slicechain.io/api/gateway/create-invoice` with merchantId, amountUsd, orderId.
2. Redirect customer to `https://pay.slicechain.io/?invoiceId=PUBLIC_INVOICE_ID`.

## Payment confirmation

- Checkout sends `postMessage` with `{ type: "slicepay:paid", orderId, txSignature, invoiceId }`.
- Return URL includes `?status=paid&tx=…&orderId=…`.
- Poll `GET /api/gateway/payment-status/:invoiceId` from your server for authoritative status.

## Testing

- Mock store: https://pay.slicechain.io/test-embed.html
- Full guide: https://slicechain.io/website-pay-widget/

## Support

slicepay@slicechain.io
