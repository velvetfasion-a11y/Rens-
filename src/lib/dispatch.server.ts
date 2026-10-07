import { timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { shippingDays, type ShipRegion } from "@/data/journal";

const places: Record<string, string> = {
  sweden: "Sweden",
  europe: "Europe",
  world: "Outside Europe",
};

export type DispatchOrder = {
  id: string;
  placed: string;
  name: string;
  email: string;
  city: string;
  qty: number;
  sent: boolean;
};

function dispatchKey() {
  const fromEnv = process.env.DISPATCH_KEY?.trim();
  if (fromEnv) return fromEnv;
  try {
    const parsed = JSON.parse(readFileSync(join(process.cwd(), ".secrets", "dispatch.json"), "utf8")) as {
      key?: string;
    };
    return parsed.key ?? "";
  } catch {
    return "";
  }
}

export function assertDispatchKey(key: string) {
  const expected = dispatchKey();
  const given = Buffer.from(key);
  const wanted = Buffer.from(expected);
  if (!expected || given.length !== wanted.length || !timingSafeEqual(given, wanted)) {
    throw new Error("That code is not recognised.");
  }
}

export async function listOrders(): Promise<DispatchOrder[]> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    placed: string;
    customer_name: string;
    customer_email: string;
    city: string;
    qty: number;
    shipped_at: string | null;
  }>`
    select id,
      to_char(created_at, 'DD Mon') as placed,
      customer_name,
      customer_email,
      city,
      qty,
      shipped_at::text as shipped_at
    from orders
    order by created_at desc
    limit 40
  `;
  return rows.map((row) => ({
    id: row.id,
    placed: row.placed,
    name: row.customer_name,
    email: row.customer_email,
    city: row.city,
    qty: Number(row.qty),
    sent: Boolean(row.shipped_at),
  }));
}

export async function sendShipped(id: string) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    customer_name: string;
    customer_email: string;
    address: string;
    postal: string;
    city: string;
    country: string;
    qty: number;
    shipped_at: string | null;
  }>`
    select id, customer_name, customer_email, address, postal, city, country, qty, shipped_at::text as shipped_at
    from orders
    where id = ${id}
  `;
  const order = rows[0];
  if (!order) throw new Error("That order was not found.");
  if (order.shipped_at) return;
  const country = order.country as ShipRegion;
  const { sendOnTheWay } = await import("@/lib/mail.server");
  await sendOnTheWay({
    customerEmail: order.customer_email,
    name: order.customer_name,
    address: order.address,
    postal: order.postal,
    city: order.city,
    country: places[order.country] ?? order.country,
    days: shippingDays(country),
    qty: Number(order.qty),
  });
  await sql`update orders set shipped_at = now() where id = ${id}`;
}
