# RENSÉ

Guided Healing Journal — TanStack Start + Vite storefront.

## Setup

```bash
npm install
```

Add local credentials under `.secrets/` (gitignored):

- `.secrets/zoho-mail.json` — `host`, `user`, `pass`
- `.secrets/dispatch.json` — `key` (password for `/dispatch`)
- `.secrets/stripe.json` — `secretKey` (or `STRIPE_SECRET_KEY` in `secrets.env`) for Stripe Checkout

Optional: `secrets.env` for extra server environment variables (also gitignored).

## Develop

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).
