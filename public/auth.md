# auth.md - SlicePay agent authentication

Machine clients integrating with SlicePay should use this document for registration and credential provisioning.

## Audience

AI agents, automation scripts, and server-side integrations that call the SlicePay Gateway API or embed hosted checkout.

## Protected resources

| Resource | Identifier |
|----------|------------|
| Gateway API | `https://api.slicechain.io/` |
| Protected resource metadata | `https://slicechain.io/.well-known/oauth-protected-resource` |

## Registration

**New merchants (human + machine provisioning)**

1. Register a business account: https://app.slicechain.io/business/onboarding/
2. Complete wallet linking in Business dashboard → Settings.
3. Copy your **merchant ID** (business `_id`) for checkout URL parameters and API calls.

**Existing merchants**

- Sign in: https://app.slicechain.io/business/login/
- Dashboard: https://app.slicechain.io/business/dashboard/

## Authentication methods

### Public endpoints (no credential)

These gateway endpoints require no authentication:

- `GET /api/gateway/invoice/:invoiceId`
- `GET /api/gateway/payment-status/:invoiceId`
- `GET /api/gateway/receipt/:invoiceId`
- `POST /api/gateway/quote`
- `POST /api/gateway/start-payment`

### API keys {#api-keys}

For server-side invoice creation, pass an optional business **API key** in the request body:

```http
POST https://api.slicechain.io/api/gateway/create-invoice
Content-Type: application/json

{
  "merchantId": "YOUR_MERCHANT_ID",
  "amountUsd": 49.99,
  "orderId": "ORD-12345",
  "apiKey": "YOUR_BUSINESS_API_KEY"
}
```

Generate or rotate API keys in Business dashboard → Settings → API Keys (when enabled for your account).

**Credential type:** `api_key` (request body field, not Bearer header).

### Session JWT (business portal)

Human operators use session-based login at `https://app.slicechain.io/business/login/`. Portal APIs accept session cookies or JWT from authenticated dashboard sessions - not intended for unattended agent use. Prefer gateway API keys for automation.

## Anonymous agent access

Agents may use public read endpoints and hosted checkout URLs without registration. To create invoices on behalf of a merchant, the merchant must provision an API key via the business dashboard.

**Claim URI:** https://slicechain.io/auth.md#api-keys

## Discovery

| Document | URL |
|----------|-----|
| API catalog (RFC 9727) | https://slicechain.io/.well-known/api-catalog |
| OpenAPI spec | https://slicechain.io/.well-known/openapi/gateway.json |
| Agent skills index | https://slicechain.io/.well-known/agent-skills/index.json |
| Integration guide | https://slicechain.io/website-pay-widget/ |
| LLM summary | https://slicechain.io/llms.txt |

## Support

- Email: slicepay@slicechain.io
- Contact: https://slicechain.io/contact/
