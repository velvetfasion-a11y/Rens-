import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAtelier } from "@/lib/atelier";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-white text-ink">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  const qty = useAtelier((s) => s.qty);
  const openBag = useAtelier((s) => s.setBagOpen);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-3 text-ink transition-colors duration-300 " +
        (solid ? "bg-white/90 backdrop-blur-md" : "bg-transparent")
      }
    >
      <Link to="/" hash="top" className="font-display text-sm tracking-[0.42em]">
        RENSÉ
      </Link>
      <button
        type="button"
        className="press inline-flex h-11 items-center gap-2 px-2"
        aria-label="Open bag"
        onClick={() => openBag(true)}
      >
        <ShoppingBag className="size-5 text-gold" strokeWidth={1.25} aria-hidden="true" />
        <span className="w-4 text-left font-serif text-sm text-gold tabular-nums">{qty || ""}</span>
      </button>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl tracking-word text-ink">RENSÉ</p>
          <p className="mt-3 text-lg text-mute">A private transformation</p>
        </div>
        <div>
          <p className="text-xs tracking-label text-gold uppercase">Rensé Advisory</p>
          <p className="mt-4 font-serif text-xl leading-snug text-ink">
            Brommavägen 7
            <br />
            Sweden
          </p>
          <a
            href="mailto:hello@rense.se"
            className="mt-4 inline-block font-serif text-xl text-ink underline decoration-ink/30 underline-offset-4"
          >
            hello@rense.se
          </a>
        </div>
        <div>
          <p className="text-xs tracking-label text-gold uppercase">Delivery</p>
          <p className="mt-4 font-serif text-xl text-ink">Sweden, 1–4 business days</p>
          <p className="mt-2 font-serif text-xl text-ink">Europe, 2–7 business days</p>
          <Link
            to="/returns"
            className="mt-6 block font-serif text-lg text-ink underline decoration-ink/30 underline-offset-4"
          >
            Refund policy
          </Link>
          <Link
            to="/privacy"
            className="mt-3 block font-serif text-lg text-ink underline decoration-ink/30 underline-offset-4"
          >
            Privacy notice
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function SaveButton() {
  const saved = useAtelier((s) => s.saved);
  const toggle = useAtelier((s) => s.toggleSaved);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label="Save this journal"
      onClick={toggle}
      className="press grid size-12 place-items-center rounded-full border border-gold/50 text-ink"
    >
      <Heart
        className={saved ? "size-5 fill-gold text-gold" : "size-5 fill-transparent text-ink/70"}
        strokeWidth={1.25}
      />
    </button>
  );
}
