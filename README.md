# RENSÉ

Guided Healing Journal — TanStack Start + Vite storefront.

## Setup

```bash
npm install
```

Copy `secrets.env.example` to `secrets.env` (gitignored) for local dev, or set these on Vercel:

- `STRIPE_SECRET_KEY`
- `ZOHO_APP_PASSWORD`, `ZOHO_SMTP_USER`, `ZOHO_SMTP_HOST`
- `DATABASE_URL` (Neon — order storage)
- `DISPATCH_KEY` (`/dispatch` password)

## Develop

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).
