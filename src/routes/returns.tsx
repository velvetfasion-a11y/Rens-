import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/returns")({
  component: ReturnsPage,
});

function ReturnsPage() {
  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link to="/" className="text-sm text-ivory underline underline-offset-4">
          RENSÉ
        </Link>
        <p className="mt-12 text-xs tracking-label text-gold uppercase">Refund policy</p>
        <h1 className="mt-4 text-4xl text-ivory sm:text-5xl">14 days</h1>
        <p className="mt-6 text-lg text-ivory">
          You may return the journal within 14 days if it is unused and undamaged.
        </p>
        <p className="mt-8 text-sm text-mute">Send it to</p>
        <p className="mt-2 text-lg text-ivory">
          Rensé Advisory
          <br />
          Brommavägen 7
          <br />
          Kramfors
        </p>
        <p className="mt-8 text-lg text-ivory">
          The price of the journal is refunded after it arrives. Transport is not included.
        </p>
        <p className="mt-6 text-base text-mute">In cooperation with Rensé Advisory.</p>
      </div>
      <SiteFooter />
    </main>
  );
}
