# Hemigo

Hemigo is a commerce platform for Nigerian small businesses. Vendors can run timed launches or always-open shops, sell physical goods, food, digital products, services, and event tickets, accept Paystack payments or issue pay-later invoices, and manage fulfillment from one dashboard.

The application uses Next.js 15, React 19, TypeScript, Prisma 6, PostgreSQL, and Paystack. Authentication, marketplace discovery, products, launches/shops, carts, inventory reservations, orders, invoices, receipts, event tickets, QR check-in, customer/vendor messages, subscriptions, fulfillment, customers, settings, CSV exports, and payout onboarding all use PostgreSQL-backed data.

## Local development

Requirements: Node.js 20+, npm, and Docker Desktop.

```bash
cp .env.example .env
npm install
docker compose up -d
npm run db:deploy
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The local seed login is:

```text
amaka@hemigo.demo
hemigo-demo
```

Seed data is for local development only. Never run `npm run db:seed` against production.

## Environment variables

Generate independent secrets with:

```bash
openssl rand -base64 48
```

| Variable                                            | Required in production | Purpose                                                                                                                |
| --------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                      | Yes                    | PostgreSQL connection string. Use SSL parameters required by the provider.                                             |
| `AUTH_SECRET`                                       | Yes                    | HMAC key for stored session and recovery-token hashes; use at least 32 random characters.                              |
| `CRON_SECRET`                                       | Yes                    | Bearer token for the maintenance endpoint.                                                                             |
| `NEXT_PUBLIC_APP_URL`                               | Yes                    | Canonical HTTPS origin, without a trailing slash. Used in email and Paystack callbacks.                                |
| `PAYSTACK_SECRET_KEY`                               | Yes                    | Paystack secret key used only by the server. Start with a test key.                                                    |
| `PAYSTACK_VENDOR_PLAN_CODE`                         | Yes                    | Paystack recurring-plan code for the ₦1,000/month vendor subscription.                                                |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`                   | Optional               | Reserved for a future inline Paystack flow; checkout currently redirects through the server-created authorization URL. |
| `PLATFORM_FEE_PERCENT`                              | Yes                    | Platform share recorded in the settlement ledger and configured on vendor subaccounts. Defaults to `4`.                |
| `EMAIL_PROVIDER_API_KEY`                            | Yes                    | Resend API key for verification and password-reset email.                                                              |
| `EMAIL_FROM`                                        | Yes                    | Verified sender, for example `Hemigo <hello@hemigo.ng>`.                                                               |
| `CONTACT_EMAIL`                                     | Yes                    | Team inbox that receives persisted Contact Us submissions.                                                             |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`          | Optional               | Google OAuth web-app credentials. Required when Google sign-in is enabled.                                             |
| `PAYSTACK_MOCK_MODE`                                | No                     | Local/test-only payment finalization. It is ignored in production.                                                     |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Local Docker only      | Credentials used by `compose.yaml`; they must match the local `DATABASE_URL`.                                          |

Changing `AUTH_SECRET` invalidates existing sessions and outstanding email/reset links.

## Database workflow

For a schema change in development:

```bash
npm run db:migrate -- --name describe_the_change
npm run db:generate
```

For every production release, run the checked-in migrations before starting the new application version:

```bash
npm run db:deploy
```

Use a managed PostgreSQL service with automated backups, point-in-time recovery, TLS, connection pooling, and separate development/staging/production databases. Docker Compose is only the local database.

## Paystack setup

1. Put test keys in the staging environment and complete a real test transaction.
2. Configure this webhook URL in Paystack: `https://YOUR_DOMAIN/api/webhooks/paystack`.
3. Paystack webhook signatures are verified against the raw request body. Events are persisted and processed idempotently.
4. Vendors enter their bank and account number during onboarding or on the Payouts page. Hemigo resolves the account and creates a Paystack subaccount.
5. Create a recurring ₦1,000/month plan and set its code as `PAYSTACK_VENDOR_PLAN_CODE`. The subscription uses the same signed webhook endpoint for activation, renewal failure, and cancellation events.
6. Move to live keys only after the domain, HTTPS, email, webhook, settlement calculation, refunds, subscriptions, and support process have been verified.

The local mock is explicit. To test the complete paid-order path without contacting Paystack, start the development server with `PAYSTACK_MOCK_MODE=true`. The application refuses mock payments in production regardless of that variable.

## Google sign-in

Create an OAuth 2.0 Web application in Google Cloud, then add this exact authorized redirect URI:

```text
https://YOUR_DOMAIN/api/auth/google/callback
```

For local development, also add `http://localhost:3000/api/auth/google/callback`. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and make sure `NEXT_PUBLIC_APP_URL` exactly matches the origin being used. The implementation uses OAuth state protection and PKCE, links users by Google subject, and only accepts Google-verified email addresses.

## Tickets and check-in

Create an event in **Dashboard → Events**, then create a ticket-type product linked to it and add that product to a launch or shop. A successful payment issues one unique QR ticket per unit. The event check-in screen can scan through the browser when `BarcodeDetector` and camera access are available, and always includes a manual token/URL fallback. Production camera access requires HTTPS.

## Scheduled maintenance

Call the endpoint below every 5 minutes from the hosting provider’s scheduler:

```text
POST /api/jobs/maintenance
Authorization: Bearer YOUR_CRON_SECRET
```

It expires abandoned inventory reservations, reconciles pending Paystack payments, updates timed window states, and removes expired sessions and auth tokens. The job is safe to run repeatedly.

The readiness endpoint is `GET /api/health`; it returns HTTP 503 when PostgreSQL is unavailable.

## Search and social metadata

Hemigo publishes `robots.txt`, a database-backed `sitemap.xml`, a web app manifest, canonical URLs, Open Graph/Twitter metadata, and structured data for the organization and public storefront offers. Set `NEXT_PUBLIC_APP_URL` to the exact canonical production origin before building so generated sitemap, social, and structured-data URLs do not point to localhost. Private account, checkout, order, invoice, receipt, ticket, message, and dashboard routes return `X-Robots-Tag: noindex` and are excluded from crawling.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

The integration suite uses the configured PostgreSQL database and verifies that concurrent customers cannot reserve the same last unit.

For the full API smoke test, run the app with the local mock and then execute:

```bash
PAYSTACK_MOCK_MODE=true npm run dev -- --port 3100
npm run test:e2e
```

The smoke test covers login, product types, timed launches, always-open shops, pay-now and pay-later checkout, invoices, receipts, messages, copywriting requests, event ticket issuance, duplicate-safe check-in, and local subscription activation. It removes its own test records and restores any pre-existing subscription state.

## Production checklist

- Provision managed PostgreSQL and run `npm run db:deploy`.
- Set all required environment variables in both staging and production.
- Verify the sender domain in Resend and test verification/reset email delivery.
- Configure Google OAuth production origins and callback URLs, then test new-account and existing-email account linking.
- Configure the Paystack webhook and complete test-mode success, duplicate-webhook, abandoned-payment, and amount-mismatch checks.
- Configure the Paystack recurring vendor plan and test activation, renewal, failed renewal, cancellation, and webhook retries.
- Test event capacity under concurrent checkout, QR delivery, valid check-in, duplicate check-in, and the manual fallback on real devices.
- Schedule the maintenance endpoint and alert on non-2xx responses.
- Point the custom domain to the host, force HTTPS, and set `NEXT_PUBLIC_APP_URL` to the exact production origin.
- Configure database backups, uptime monitoring for `/api/health`, application error reporting, and log retention with secrets/PII redaction.
- Run typecheck, lint, unit/integration tests, the E2E smoke test in staging, and the production build for every release.
- Document refund, chargeback, vendor verification, customer support, and payout-reconciliation procedures before accepting live money.
