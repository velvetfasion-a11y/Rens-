import { createServerFn } from "@tanstack/react-start";

function readKey(input: unknown) {
  if (!input || typeof input !== "object") throw new Error("Enter the code.");
  const key = String((input as { key?: unknown }).key ?? "").trim();
  if (!key) throw new Error("Enter the code.");
  return key;
}

export const listDispatchOrders = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ({ key: readKey(input) }))
  .handler(async ({ data }) => {
    const { assertDispatchKey, listOrders } = await import("@/lib/dispatch.server");
    assertDispatchKey(data.key);
    return listOrders();
  });

export const markOrderSent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Enter the code.");
    const raw = input as { key?: unknown; id?: unknown };
    const id = String(raw.id ?? "").trim();
    if (!id) throw new Error("That order was not found.");
    return { key: readKey(input), id };
  })
  .handler(async ({ data }) => {
    const { assertDispatchKey, sendShipped } = await import("@/lib/dispatch.server");
    assertDispatchKey(data.key);
    await sendShipped(data.id);
    return { ok: true };
  });
