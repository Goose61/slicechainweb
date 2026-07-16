export const legalMeta = {
  company: "SliceChain Holdings Inc.",
  product: "SlicePay®",
  contactEmail: "slicepay@slicechain.io",
  effectiveDate: "June 7, 2026",
  website: "slicechain.io",
};

export const privacyPolicy = {
  title: "Privacy Policy",
  lastUpdated: legalMeta.effectiveDate,
  sections: [
    {
      heading: "1. Introduction",
      body: `SliceChain Holdings Inc. ("SliceChain," "we," "us," or "our") operates SlicePay, a crypto payment gateway and blockchain payment processor that helps merchants accept cryptocurrency payments, QR code crypto checkout, and USDC payments for business. This Privacy Policy explains how we collect, use, disclose, and protect personal information when you visit our websites, create an account, or use SlicePay multi-chain crypto payment services.

By registering for or using SlicePay, you acknowledge this Privacy Policy. If you do not agree, do not use the platform.`,
    },
    {
      heading: "2. Information We Collect",
      body: `We collect information depending on how you use SlicePay:

**Account and profile information**
- Name, email address, phone number, and account credentials (passwords are stored only as secure hashes, never in plain text)
- Business legal name, trading name, registration details, tax identification, business address, and contact information for business accounts
- Employee name, email, business affiliation, and optional Solana wallet address for commission payouts
- Customer name and email for customer accounts

**Payment and transaction information**
- Payment amounts, timestamps, transaction references, fee calculations, commission allocations, and settlement records
- Public blockchain wallet addresses involved in a transaction
- SLICE loyalty token balances and reward activity associated with your account

**Verification and compliance information**
- Business verification documents you upload (for example, business license or tax documentation)
- Identity verification data when required for regulated features such as investment token conversion, which may be collected through third-party KYC providers

**Technical and security information**
- IP address, browser type, device information, and user agent string
- Login history, authentication events, and security logs used for fraud prevention and account protection
- Session and authentication tokens stored in your browser (local storage or session storage) when you choose to remain signed in`,
    },
    {
      heading: "3. Information We Do Not Collect",
      body: `SlicePay is designed as a non-custodial payment platform. We do not ask you to provide, and we do not store, the private keys or seed phrases for your self-custodied cryptocurrency wallets.

We do not collect traditional payment card numbers (PAN) for card processing through SlicePay's core wallet-based checkout flow. Payment activity occurs through supported digital asset wallets and blockchain networks.`,
    },
    {
      heading: "4. How We Use Information",
      body: `We use personal information to:

- Create, authenticate, and manage user, business, and employee accounts
- Process payments, calculate platform fees, distribute employee commissions, and settle USDC and USDT payouts across supported chains where applicable
- Operate SLICE loyalty rewards and related platform features
- Verify business identity and support compliance obligations
- Send transactional communications such as account verification, security alerts, and service notices
- Detect, investigate, and prevent fraud, abuse, and unauthorized access
- Maintain records required for operations, accounting, dispute handling, and legal compliance
- Improve platform reliability, security, and user experience`,
    },
    {
      heading: "5. Legal Bases for Processing",
      body: `Where applicable privacy laws require a legal basis, we rely on:

- **Performance of a contract** - to provide SlicePay services you request
- **Legitimate interests** - to secure the platform, prevent fraud, and improve our services
- **Legal obligation** - to comply with applicable law, regulatory requests, and recordkeeping requirements
- **Consent** - where required, such as for optional marketing communications or certain verification flows`,
    },
    {
      heading: "6. How We Share Information",
      body: `We do not sell your personal information. We may share information with:

- **Service providers** that help us operate SlicePay, such as cloud hosting, email delivery, identity verification, and infrastructure providers, under contractual confidentiality and security obligations
- **Blockchain networks**, where transaction data and wallet addresses are recorded on public ledgers visible to anyone
- **Business counterparties**, where necessary to complete a payment you initiate or to administer commissions between a merchant and its employees
- **Professional advisors and authorities** when required by law, court order, or to protect rights, safety, and platform integrity

We share only the information reasonably necessary for each purpose.`,
    },
    {
      heading: "7. Data Retention",
      body: `We retain personal information for as long as your account is active and as needed to provide services, resolve disputes, enforce agreements, and meet legal, tax, accounting, and compliance obligations. Transaction and business records may be retained for a longer period where required for financial recordkeeping or regulatory purposes.

When information is no longer needed, we delete it or anonymize it in accordance with our retention practices and applicable law.`,
    },
    {
      heading: "8. Security",
      body: `We use administrative, technical, and organizational safeguards designed to protect personal information, including access controls, encrypted credential storage, rate limiting, account lockout protections, and audit logging. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.`,
    },
    {
      heading: "9. Your Rights and Choices",
      body: `Depending on your location, you may have rights to access, correct, delete, or restrict certain processing of your personal information, or to object to certain uses. You may also withdraw consent where processing is consent-based.

To make a request, contact us at ${legalMeta.contactEmail}. We may need to verify your identity before responding. Some requests may be limited where we must retain data for legal, security, or financial recordkeeping reasons.`,
    },
    {
      heading: "10. Cookies and Local Storage",
      body: `SlicePay uses browser local storage and session storage to keep you signed in and to remember interface preferences. Our marketing site may use essential site functionality only unless additional analytics tools are introduced later, in which case this policy will be updated.

You can clear stored browser data through your browser settings, but doing so may sign you out of the platform.`,
    },
    {
      heading: "11. International Users",
      body: `SlicePay may be accessed from multiple countries. If you use SlicePay from outside the United States, your information may be processed and stored in the United States or other locations where our service providers operate. We take steps designed to protect information in accordance with this policy.`,
    },
    {
      heading: "12. Children's Privacy",
      body: `SlicePay is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us information, contact us at ${legalMeta.contactEmail}.`,
    },
    {
      heading: "13. Changes to This Policy",
      body: `We may update this Privacy Policy from time to time. The "Last updated" date at the top will reflect the latest version. Material changes will be posted on this page. Continued use of SlicePay after an update constitutes acceptance of the revised policy.`,
    },
    {
      heading: "14. Contact Us",
      body: `For privacy questions or requests:

**${legalMeta.company}**
Email: ${legalMeta.contactEmail}
Product: ${legalMeta.product}`,
    },
  ],
};

export const termsAndConditions = {
  title: "Terms and Conditions",
  lastUpdated: legalMeta.effectiveDate,
  sections: [
    {
      heading: "1. Agreement to Terms",
      body: `These Terms and Conditions ("Terms") govern access to and use of SlicePay, a crypto payment gateway operated by SliceChain Holdings Inc. ("SliceChain," "we," "us," or "our"). By creating an account, registering a business, or using any SlicePay service to accept cryptocurrency payments or QR code crypto payments, you agree to these Terms and our Privacy Policy.

If you are using SlicePay on behalf of a business, you represent that you have authority to bind that business to these Terms for USDC payments, multi-chain crypto payments, and related blockchain payment processor features.`,
    },
    {
      heading: "2. Description of Service",
      body: `SlicePay provides tools for businesses to accept wallet-based payments, manage checkout flows, distribute SLICE loyalty rewards, and process related operational features such as employee commission tracking and cross-chain USDC and USDT settlement where supported.

SlicePay is a technology platform. **SlicePay is not a bank, money transmitter, broker-dealer, or investment adviser.** We do not hold customer funds in traditional deposit accounts and we do not provide custodial wallet services for user private keys.`,
    },
    {
      heading: "3. Eligibility",
      body: `You must be at least 18 years old and capable of entering a binding contract to use SlicePay. Businesses must provide accurate registration information and maintain authority to accept payments and enter commercial agreements.

You may not use SlicePay if you are prohibited from doing so under applicable law or if your account has been suspended or terminated by us.`,
    },
    {
      heading: "4. Accounts and Registration",
      body: `You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. You agree to provide accurate, current, and complete information during registration and to update it when it changes.

Business registrations may require additional verification documents. We may approve, reject, or suspend accounts at our discretion to manage risk, fraud, or compliance concerns.`,
    },
    {
      heading: "5. Payments, Fees, and Settlement",
      body: `SlicePay supports variable payment amounts through supported wallet and blockchain payment flows. Platform fees, business fees, employee commissions, and payout mechanics are disclosed in the product interface and may be updated from time to time.

Unless otherwise stated in writing, current standard pricing includes a total business fee of 1.9% and an employee commission of 0.3% of the applicable platform fee where an employee facilitates a qualifying transaction. **Fees are subject to change** with notice through the platform or website.

Settlement to business owners and employees occurs in USDC and USDT on supported compliant chains where the service is enabled. Blockchain transactions are irreversible once confirmed. You are solely responsible for providing correct wallet addresses and reviewing transaction details before authorization.`,
    },
    {
      heading: "6. Non-Custodial Wallets and Blockchain Risk",
      body: `SlicePay integrates with user-controlled wallets. You retain control of your private keys and wallet security. We are not responsible for lost keys, wallet compromise, incorrect addresses, network congestion, chain forks, smart contract failures, or losses arising from blockchain or third-party wallet provider issues.

Blockchain transactions are public by nature. Wallet addresses and on-chain activity may be visible to third parties.`,
    },
    {
      heading: "7. SLICE Loyalty Rewards",
      body: `SLICE loyalty tokens are platform rewards used within the SlicePay ecosystem according to published program rules. SLICE tokens are not guaranteed to have monetary value outside the platform, may be subject to program limits, and may be modified or discontinued in accordance with applicable law and platform notices.`,
    },
    {
      heading: "8. Prohibited Uses",
      body: `You may not use SlicePay to:

- Violate any law, regulation, sanctions rule, or third-party right
- Process unlawful goods or services, fraud, money laundering, or terrorist financing
- Interfere with platform security, access systems without authorization, or transmit malware
- Misrepresent your identity, business, or transaction details
- Circumvent fees, limits, or compliance controls

We may investigate violations and cooperate with law enforcement where appropriate.`,
    },
    {
      heading: "9. Compliance and Verification",
      body: `Certain features, including investment token conversion and enhanced financial services, may require identity verification through third-party providers. You agree to cooperate with reasonable verification requests and to provide accurate supporting information.

You are responsible for determining whether use of SlicePay is permitted for your business category and jurisdiction.`,
    },
    {
      heading: "10. Intellectual Property",
      body: `SlicePay, SliceChain, and related logos, software, content, and branding are owned by SliceChain or its licensors and are protected by intellectual property laws. You receive a limited, non-exclusive, non-transferable right to use the platform solely for its intended business purpose while your account remains in good standing.`,
    },
    {
      heading: "11. Service Availability and Changes",
      body: `We strive to maintain reliable service but do not guarantee uninterrupted or error-free operation. We may modify, suspend, or discontinue features with reasonable notice where practicable. Beta or experimental features may be offered as-is.`,
    },
    {
      heading: "12. Disclaimers",
      body: `SLICEPAY IS PROVIDED "AS IS" AND "AS AVAILABLE." TO THE MAXIMUM EXTENT PERMITTED BY LAW, SLICECHAIN DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not guarantee blockchain network performance, digital asset prices, regulatory treatment of digital assets, or merchant sales outcomes.`,
    },
    {
      heading: "13. Limitation of Liability",
      body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, SLICECHAIN AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, LOST DATA, OR BUSINESS INTERRUPTION, ARISING FROM OR RELATED TO YOUR USE OF SLICEPAY.

OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR SLICEPAY WILL NOT EXCEED THE GREATER OF (A) THE FEES PAID BY YOU TO SLICECHAIN FOR SLICEPAY IN THE THREE (3) MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS (US $100), EXCEPT WHERE LIABILITY CANNOT BE LIMITED BY APPLICABLE LAW.`,
    },
    {
      heading: "14. Indemnification",
      body: `You agree to indemnify and hold harmless SliceChain from claims, losses, liabilities, damages, and expenses (including reasonable legal fees) arising from your use of SlicePay, your transactions, your breach of these Terms, or your violation of law or third-party rights.`,
    },
    {
      heading: "15. Suspension and Termination",
      body: `We may suspend or terminate access to SlicePay immediately if we reasonably believe you violated these Terms, created security or compliance risk, or if required by law. You may stop using SlicePay at any time. Provisions that by their nature should survive termination will survive, including payment obligations, disclaimers, limitations of liability, and dispute terms.`,
    },
    {
      heading: "16. Governing Law and Disputes",
      body: `These Terms are governed by the laws of the United States, without regard to conflict-of-law principles, except where mandatory local consumer protections apply. Any dispute arising from these Terms or SlicePay will be brought in the courts located in the jurisdiction of SliceChain's principal place of business, unless applicable law requires otherwise.`,
    },
    {
      heading: "17. Changes to Terms",
      body: `We may update these Terms from time to time. The "Last updated" date above indicates the current version. Continued use of SlicePay after updated Terms are posted constitutes acceptance, except where further consent is required by law.`,
    },
    {
      heading: "18. Contact",
      body: `Questions about these Terms:

**${legalMeta.company}**
Email: ${legalMeta.contactEmail}
Product: ${legalMeta.product}`,
    },
  ],
};
