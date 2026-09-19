# Hemigo

Hemigo is a batch-selling storefront for Nigerian small businesses. Vendors create products, publish timed selling windows, accept Paystack payments, manage fulfillment, and track settlement records from one dashboard.

The application uses Next.js 15, React 19, TypeScript, Prisma 6, PostgreSQL, and Paystack. Authentication, products, windows, carts, inventory reservations, orders, payment finalization, fulfillment, customers, settings, CSV exports, and payout onboarding all use PostgreSQL-backed data.

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
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`                   | Optional               | Reserved for a future inline Paystack flow; checkout currently redirects through the server-created authorization URL. |
| `PLATFORM_FEE_PERCENT`                              | Yes                    | Platform share recorded in the settlement ledger and configured on vendor subaccounts. Defaults to `4`.                |
| `EMAIL_PROVIDER_API_KEY`                            | Yes                    | Resend API key for verification and password-reset email.                                                              |
| `EMAIL_FROM`                                        | Yes                    | Verified sender, for example `Hemigo <hello@hemigo.ng>`.                                                               |
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
5. Move to live keys only after the domain, HTTPS, email, webhook, settlement calculation, refunds, and support process have been verified.

The local mock is explicit. To test the complete paid-order path without contacting Paystack, start the development server with `PAYSTACK_MOCK_MODE=true`. The application refuses mock payments in production regardless of that variable.

## Scheduled maintenance

Call the endpoint below every 5 minutes from the hosting provider’s scheduler:

```text
POST /api/jobs/maintenance
Authorization: Bearer YOUR_CRON_SECRET
```

It expires abandoned inventory reservations, reconciles pending Paystack payments, updates timed window states, and removes expired sessions and auth tokens. The job is safe to run repeatedly.

The readiness endpoint is `GET /api/health`; it returns HTTP 503 when PostgreSQL is unavailable.

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

The smoke test logs in, creates a product and selling window, opens the public storefront, reserves stock, finalizes payment, verifies the paid order, and removes its test records.

## Production checklist

- Provision managed PostgreSQL and run `npm run db:deploy`.
- Set all required environment variables in both staging and production.
- Verify the sender domain in Resend and test verification/reset email delivery.
- Configure the Paystack webhook and complete test-mode success, duplicate-webhook, abandoned-payment, and amount-mismatch checks.
- Schedule the maintenance endpoint and alert on non-2xx responses.
- Point the custom domain to the host, force HTTPS, and set `NEXT_PUBLIC_APP_URL` to the exact production origin.
- Configure database backups, uptime monitoring for `/api/health`, application error reporting, and log retention with secrets/PII redaction.
- Run typecheck, lint, unit/integration tests, the E2E smoke test in staging, and the production build for every release.
- Document refund, chargeback, vendor verification, customer support, and payout-reconciliation procedures before accepting live money.
