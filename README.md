# Hemigo

Sell in batches. Close on schedule. Fulfill without chaos.

## Local setup

```bash
cp .env.example .env
npm install
docker compose up -d
npm run db:push
npm run db:seed
npm run dev
```

Generate a secure session secret with `openssl rand -base64 48` and use the result as `AUTH_SECRET`. The local Compose database reads `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` from the same `.env`; `DATABASE_URL` must contain matching values.

The UI uses typed demo data until PostgreSQL is configured. Production commerce boundaries live in `src/lib/services` and the Paystack webhook route.

After seeding, the demo vendor login is `amaka@hemigo.demo` / `hemigo-demo`.
