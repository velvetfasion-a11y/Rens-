import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { JOURNAL, shippingCost, shippingDays, type ShipRegion } from "@/data/journal";
import { stripeClient } from "@/lib/stripe.server";

const SHOP = "hello@rense.se";

const countries: Record<Exclude<ShipRegion, "">, string> = {
  sweden: "Sweden",
  europe: "Europe",
  world: "Outside Europe",
};

export const methods = {
  apple: "Apple Pay",
  card: "Mastercard",
  paypal: "PayPal",
  klarna: "Klarna",
} as const;

export type OrderInput = {
  name: string;
  email: string;
  address: string;
  postal: string;
  city: string;
  country: Exclude<ShipRegion, "">;
  qty: number;
  method: keyof typeof methods;
};

function clean(value: string, max: number) {
  return value.trim().slice(0, max);
}

export function readOrder(input: unknown): OrderInput {
  if (!input || typeof input !== "object") throw new Error("Enter the delivery details.");
  const raw = input as Record<string, unknown>;
  const name = clean(String(raw.name ?? ""), 200);
  const email = clean(String(raw.email ?? ""), 200);
  const address = clean(String(raw.address ?? ""), 300);
  const postal = clean(String(raw.postal ?? ""), 20);
  const city = clean(String(raw.city ?? ""), 120);
  const country = raw.country;
  const method = raw.method;
  const qty = Number(raw.qty);
  if (!name || !address || !postal || !city) throw new Error("Enter the name and the address for delivery.");
  if (!email.includes("@") || !email.includes(".")) throw new Error("Enter an email address.");
  if (country !== "sweden" && country !== "europe" && country !== "world") {
    throw new Error("Choose a country.");
  }
  if (method !== "apple" && method !== "card" && method !== "paypal" && method !== "klarna") {
    throw new Error("Choose a way to pay.");
  }
  if (!Number.isInteger(qty) || qty < 1 || qty > 20) throw new Error("Choose a quantity.");
  return { name, email, address, postal, city, country, qty, method };
}

function orderText(order: OrderInput, goods: number, delivery: number) {
  const place = countries[order.country];
  const days = shippingDays(order.country);
  return [
    "New order for the Guided Healing Journal.",
    "",
    `Name: ${order.name}`,
    `Email: ${order.email}`,
    `Address: ${order.address}`,
    `Postcode: ${order.postal}`,
    `City: ${order.city}`,
    `Country: ${place}`,
    "",
    `Quantity: ${order.qty}`,
    `Journal: ${goods} kr`,
    `Delivery: ${delivery === 0 ? "Free" : `${delivery} kr`}`,
    `Total: ${goods + delivery} kr`,
    `Payment: ${methods[order.method]}`,
    days ? `Delivery time: ${days}` : "Delivery time: to be confirmed",
    "",
    "Send the journal to the address above.",
  ].join("\n");
}

function receiptText(order: OrderInput, goods: number, delivery: number) {
  const place = countries[order.country];
  const days = shippingDays(order.country);
  return [
    "Thank you. This is your receipt from Rensé Advisory.",
    "",
    "Guided Healing Journal",
    `Quantity: ${order.qty}`,
    `Journal: ${goods} kr`,
    `Delivery: ${delivery === 0 ? "Free" : `${delivery} kr`}`,
    `Total: ${goods + delivery} kr`,
    `Payment: ${methods[order.method]}`,
    days ? `Delivery time: ${days}` : "",
    "",
    "Sent to:",
    order.name,
    order.address,
    `${order.postal} ${order.city}`,
    place,
    "",
    "Rensé Advisory",
    "Brommavägen 7, Kramfors, Sweden",
    SHOP,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function requestOrigin() {
  const request = getRequest();
  if (!request) throw new Error("The checkout could not be started. Try again.");
  return new URL(request.url).origin;
}

export const createStripeCheckout = createServerFn({ method: "POST" })
  .inputValidator(readOrder)
  .handler(async ({ data: order }) => {
    const stripe = stripeClient();
    const origin = requestOrigin();
    const goods = JOURNAL.price * order.qty;
    const delivery = shippingCost(order.qty, order.country) ?? 0;
    const lineItems: { price_data: { currency: string; product_data: { name: string }; unit_amount: number }; quantity: number }[] = [
      {
        price_data: {
          currency: "sek",
          product_data: { name: JOURNAL.name },
          unit_amount: JOURNAL.price * 100,
        },
        quantity: order.qty,
      },
    ];
    if (delivery > 0) {
      lineItems.push({
        price_data: {
          currency: "sek",
          product_data: { name: "Delivery" },
          unit_amount: delivery * 100,
        },
        quantity: 1,
      });
    }
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "sek",
      customer_email: order.email,
      line_items: lineItems,
      success_url: `${origin}/order/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: {
        name: order.name,
        email: order.email,
        address: order.address,
        postcode: order.postal,
        city: order.city,
        country: order.country,
        quantity: String(order.qty),
        method: order.method,
      },
    });
    if (!session.url) throw new Error("The checkout could not be started. Try again.");
    return { url: session.url };
  });

export type FulfillResult =
  | { status: "missing" }
  | { status: "unpaid" }
  | { status: "failed"; message: string }
  | { status: "paid"; email: string; message?: string }
  | { status: "already"; email: string };

function fulfillErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message.trim()) return err.message.trim();
  return "The order could not be confirmed on the server.";
}

function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

async function orderAlreadyStored(sessionId: string): Promise<boolean> {
  if (!databaseConfigured()) return false;
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ id: string }>`select id from orders where id = ${sessionId} limit 1`;
    return rows.length > 0;
  } catch (err) {
    console.error("[fulfillCheckoutSession] order lookup failed", err);
    return false;
  }
}

async function storeOrder(
  sessionId: string,
  order: OrderInput,
  goods: number,
  delivery: number,
  total: number,
  place: string,
) {
  if (!databaseConfigured()) return;
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      insert into orders (
        id, customer_name, customer_email, address, postal, city, country,
        qty, method, goods_kr, delivery_kr, total_kr
      ) values (
        ${sessionId}, ${order.name}, ${order.email}, ${order.address}, ${order.postal},
        ${order.city}, ${place}, ${order.qty}, ${order.method}, ${goods}, ${delivery}, ${total}
      )
      on conflict (id) do nothing
    `;
  } catch (err) {
    console.error("[fulfillCheckoutSession] order save failed", err);
  }
}

function readOrderFromSessionMeta(meta: Record<string, string | undefined>): OrderInput | { error: string } {
  try {
    return readOrder({
      name: meta.name,
      email: meta.email,
      address: meta.address,
      postal: meta.postcode,
      city: meta.city,
      country: meta.country,
      qty: meta.quantity,
      method: meta.method,
    });
  } catch (err) {
    return { error: fulfillErrorMessage(err) };
  }
}

export const fulfillCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const sessionId =
      input && typeof input === "object"
        ? String((input as { sessionId?: string }).sessionId ?? "").trim()
        : "";
    return { sessionId };
  })
  .handler(async ({ data: { sessionId } }): Promise<FulfillResult> => {
    if (!sessionId) {
      return { status: "failed", message: "Missing checkout session id." };
    }
    try {
      const stripe = stripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        return { status: "unpaid" };
      }

      const parsed = readOrderFromSessionMeta(session.metadata ?? {});
      if ("error" in parsed) {
        return { status: "failed", message: parsed.error };
      }
      const order = parsed;
      const goods = JOURNAL.price * order.qty;
      const delivery = shippingCost(order.qty, order.country) ?? 0;
      const total = goods + delivery;
      const place = countries[order.country];
      const days = shippingDays(order.country);

      if (await orderAlreadyStored(session.id)) {
        return { status: "already", email: order.email };
      }

      const shopText = orderText(order, goods, delivery);
      const receipt = receiptText(order, goods, delivery);
      let mailMessage: string | undefined;
      try {
        const { sendOrderMail } = await import("@/lib/mail.server");
        await sendOrderMail({
          customerEmail: order.email,
          customerName: order.name,
          address: order.address,
          postal: order.postal,
          city: order.city,
          country: place,
          qty: order.qty,
          goods,
          delivery,
          total,
          method: methods[order.method],
          days,
          receipt,
          shopText,
        });
      } catch (mailErr) {
        console.error("[fulfillCheckoutSession] receipt email failed", mailErr);
        mailMessage = fulfillErrorMessage(mailErr);
      }

      await storeOrder(session.id, order, goods, delivery, total, place);

      return mailMessage
        ? { status: "paid", email: order.email, message: mailMessage }
        : { status: "paid", email: order.email };
    } catch (err) {
      console.error("[fulfillCheckoutSession]", err);
      return { status: "failed", message: fulfillErrorMessage(err) };
    }
  });
