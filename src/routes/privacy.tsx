import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link to="/" className="text-sm text-ivory underline underline-offset-4">
          RENSÉ
        </Link>
        <p className="mt-12 text-xs tracking-label text-gold uppercase">Privacy notice</p>
        <h1 className="mt-4 text-4xl text-ivory sm:text-5xl">Your details</h1>
        <p className="mt-6 text-lg text-ivory">
          Rensé Advisory, Brommavägen 7, Kramfors, Sweden, is responsible for the details you give when you order.
          Write to hello@rense.se if you want to see them, correct them, or ask a question.
        </p>
        <p className="mt-6 text-lg text-ivory">
          We use your name, email, and delivery address to send the journal, confirm the order, and handle a return.
          We do not sell these details.
        </p>
        <p className="mt-6 text-lg text-ivory">
          Payment is taken on Stripe. RENSÉ does not keep your card number.
        </p>
        <p className="mt-6 text-lg text-ivory">
          The order is kept for as long as it is needed to deliver the journal, complete a refund, and meet ordinary bookkeeping.
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
