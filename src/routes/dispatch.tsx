import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { listDispatchOrders, markOrderSent } from "@/lib/dispatch";

type Order = {
  id: string;
  placed: string;
  name: string;
  email: string;
  city: string;
  qty: number;
  sent: boolean;
};

export const Route = createFileRoute("/dispatch")({
  component: DispatchPage,
});

function DispatchPage() {
  const [code, setCode] = useState("");
  const [ready, setReady] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");

  async function open() {
    setError("");
    try {
      const next = await listDispatchOrders({ data: { key: code } });
      setOrders(next);
      setReady(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code is not recognised.");
    }
  }

  async function send(id: string) {
    setPending(id);
    setError("");
    try {
      await markOrderSent({ data: { key: ready, id } });
      setOrders((current) => current.map((order) => (order.id === id ? { ...order, sent: true } : order)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The note could not be sent.");
    } finally {
      setPending("");
    }
  }

  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-xl px-6 py-20">
        <Link to="/" className="text-sm text-ivory underline underline-offset-4">
          RENSÉ
        </Link>
        <p className="mt-12 text-xs tracking-label text-gold uppercase">Dispatch</p>
        <h1 className="mt-4 text-4xl text-ivory">On its way</h1>
        {ready ? (
          <ul className="mt-12">
            {orders.length === 0 ? <li className="text-lg text-mute">No orders yet.</li> : null}
            {orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-6 border-t border-ivory/15 py-5">
                <div>
                  <p className="text-lg text-ivory">{order.name}</p>
                  <p className="mt-1 text-sm text-mute">
                    {order.city} · {order.qty} · {order.placed}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={order.sent || pending === order.id}
                  onClick={() => void send(order.id)}
                  className="press h-10 shrink-0 border border-ivory/30 px-4 text-sm text-ivory disabled:opacity-40"
                >
                  {order.sent ? "Sent" : pending === order.id ? "Sending" : "On its way"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <form
            className="mt-12"
            onSubmit={(event) => {
              event.preventDefault();
              void open();
            }}
          >
            <label className="block text-sm text-mute" htmlFor="dispatch-code">
              Code
            </label>
            <input
              id="dispatch-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="mt-2 h-12 w-full border border-ivory/20 bg-transparent px-3 text-ivory outline-none"
              autoComplete="off"
            />
            <button type="submit" className="press mt-6 h-12 w-full bg-ivory text-sm text-ink">
              Open orders
            </button>
          </form>
        )}
        {error ? <p className="mt-6 text-sm text-ivory">{error}</p> : null}
      </div>
    </main>
  );
}
