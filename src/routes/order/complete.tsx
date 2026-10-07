import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { useAtelier } from "@/lib/atelier";
import { fulfillCheckoutSession, type FulfillResult } from "@/lib/orders";

export const Route = createFileRoute("/order/complete")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  component: OrderCompletePage,
});

function OrderCompletePage() {
  const { session_id } = Route.useSearch();
  const setQty = useAtelier((state) => state.setQty);
  const [result, setResult] = useState<FulfillResult | { status: "loading" } | { status: "error" }>({
    status: "loading",
  });

  useEffect(() => {
    if (!session_id) {
      setResult({ status: "missing" });
      return;
    }
    void fulfillCheckoutSession({ data: { sessionId: session_id } })
      .then((next) => {
        setResult(next);
        if (next.status === "paid" || next.status === "already") setQty(0);
      })
      .catch(() => setResult({ status: "error" }));
  }, [session_id, setQty]);

  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link to="/" className="text-sm text-ivory underline underline-offset-4">
          RENSÉ
        </Link>
        {result.status === "loading" ? (
          <p className="mt-12 text-lg text-ivory">Confirming your payment…</p>
        ) : null}
        {result.status === "missing" || result.status === "error" ? (
          <p className="mt-12 text-lg text-ivory">This order could not be confirmed. Return to the shop and try again.</p>
        ) : null}
        {result.status === "unpaid" ? (
          <p className="mt-12 text-lg text-ivory">Payment was not completed. Nothing was charged and no receipt was sent.</p>
        ) : null}
        {(result.status === "paid" || result.status === "already") && "email" in result ? (
          <>
            <p className="mt-12 text-xs tracking-label text-gold uppercase">Thank you</p>
            <h1 className="mt-4 text-4xl text-ivory sm:text-5xl">Payment received</h1>
            <p className="mt-6 text-lg text-ivory">The journal is on its way.</p>
            <p className="mt-4 text-base text-mute">
              A receipt will be sent to {result.email} from hello@rense.se.
            </p>
          </>
        ) : null}
      </div>
      <SiteFooter />
    </main>
  );
}
