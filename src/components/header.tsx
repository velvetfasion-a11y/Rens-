import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useAtelier } from "@/lib/atelier";

export function Header() {
  const qty = useAtelier((state) => state.qty);
  const setBagOpen = useAtelier((state) => state.setBagOpen);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-3 transition-colors duration-300 ${
        scrolled ? "bg-ink/90" : "bg-transparent"
      }`}
    >
      <a href="#top" className="font-display text-lg tracking-word text-ivory">
        RENSÉ
      </a>
      <button
        type="button"
        className="press inline-flex h-11 items-center gap-2 px-2 text-ivory"
        onClick={() => setBagOpen(true)}
        aria-label={qty > 0 ? `Open bag, ${qty} inside` : "Open bag"}
      >
        <ShoppingBag className="size-5" strokeWidth={1.25} />
        <span className="w-4 text-left font-serif text-sm tabular-nums text-gold">
          {qty > 0 ? qty : ""}
        </span>
      </button>
    </header>
  );
}
