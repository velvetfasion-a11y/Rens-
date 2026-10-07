import { readFileSync } from "node:fs";
import { join } from "node:path";
import Stripe from "stripe";

const MISSING_SECRET =
  "Add your Stripe secret or restricted key to .secrets/stripe.json (secretKey) or set STRIPE_SECRET_KEY.";

function isStripeServerKey(key: string) {
  return key.startsWith("sk_") || key.startsWith("rk_");
}

type StripeSecrets = {
  publishableKey?: string;
  secretKey?: string;
};

function readStripeSecrets(): StripeSecrets {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), ".secrets", "stripe.json"), "utf8")) as StripeSecrets;
  } catch {
    return {};
  }
}

/** Stripe publishable key (`pk_…`) — optional; Checkout does not require it on the client. */
export function stripePublishableKey(): string | undefined {
  const key = readStripeSecrets().publishableKey?.trim();
  return key || undefined;
}

/** Stripe secret (`sk_…`) or restricted (`rk_…`) key from env or `.secrets/stripe.json`. */
export function requireStripeSecretKey(): string {
  const key =
    process.env.STRIPE_SECRET_KEY?.trim() || readStripeSecrets().secretKey?.trim() || "";
  if (!isStripeServerKey(key)) {
    throw new Error(MISSING_SECRET);
  }
  return key;
}

export function stripeClient(): Stripe {
  return new Stripe(requireStripeSecretKey());
}
