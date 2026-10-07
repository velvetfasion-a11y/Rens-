import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-ivory/15 bg-ink">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl tracking-word text-ivory">RENSÉ</p>
          <p className="mt-3 text-lg text-mute">A private transformation</p>
        </div>
        <div>
          <p className="text-xs tracking-label text-gold uppercase">Rensé Advisory</p>
          <p className="mt-4 text-lg text-ivory">
            Brommavägen 7
            <br />
            Kramfors
            <br />
            Sweden
          </p>
          <a href="mailto:hello@rense.se" className="mt-4 inline-block text-lg text-ivory underline underline-offset-4">
            hello@rense.se
          </a>
        </div>
        <div>
          <p className="text-xs tracking-label text-gold uppercase">Delivery</p>
          <p className="mt-4 text-lg text-ivory">Sweden, 1–4 business days, 59 kr</p>
          <p className="mt-2 text-lg text-ivory">Europe, 2–7 business days, 99 kr</p>
          <Link to="/returns" className="mt-6 block text-sm text-ivory underline underline-offset-4">
            Refund policy
          </Link>
          <Link to="/privacy" className="mt-3 block text-sm text-ivory underline underline-offset-4">
            Privacy notice
          </Link>
          <Link to="/copyright" className="mt-3 block text-sm text-ivory underline underline-offset-4">
            Copyright
          </Link>
        </div>
      </div>
    </footer>
  );
}
