import Stripe from "stripe";

const MISSING_SECRET = "STRIPE_SECRET_KEY is not set on the server.";

function isStripeServerKey(key: string) {
  return key.startsWith("sk_") || key.startsWith("rk_");
}

/** Stripe secret (`sk_…`) or restricted (`rk_…`) key from `STRIPE_SECRET_KEY`. */
export function requireStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  if (!isStripeServerKey(key)) {
    throw new Error(MISSING_SECRET);
  }
  return key;
}

export function stripeClient(): Stripe {
  return new Stripe(requireStripeSecretKey());
}
