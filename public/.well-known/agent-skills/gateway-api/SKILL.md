# SlicePay Gateway API

Integrate SlicePay crypto checkout on e-commerce sites and custom apps.

## When to use

Use this skill when you need to create hosted checkout invoices, poll payment status, or embed the SlicePay payment gateway.

## Base URL

`https://api.slicechain.io/api/gateway`

## Authentication

- Most read endpoints are public (invoice lookup, payment status, quotes).
- `POST /create-invoice` accepts an optional `apiKey` from the merchant business dashboard for server-side invoice creation.
- See `/auth.md` on slicechain.io for agent registration and API key provisioning.

## Key endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/create-invoice` | Create a server-side invoice (recommended for production) |
| GET | `/invoice/:invoiceId` | Load invoice details |
| POST | `/quote` | Get checkout quote for chain/token selection |
| POST | `/start-payment` | Begin payment session for an invoice |
| GET | `/payment-status/:invoiceId` | Poll authoritative payment status |
| GET | `/receipt/:invoiceId` | Fetch receipt JSON or HTML |

## OpenAPI

`https://slicechain.io/.well-known/openapi/gateway.json`

## Documentation

- Integration guide: https://slicechain.io/website-pay-widget/
- Hosted checkout: https://pay.slicechain.io/
- Embed script: https://pay.slicechain.io/embed.js

## Health

`GET https://api.slicechain.io/api/health`
