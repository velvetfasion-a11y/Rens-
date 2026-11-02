import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { type ReactNode } from "react";
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

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-white pr-3 pl-5 text-ink">
      <Link to="/" hash="top" className="font-display text-sm tracking-[0.42em]">
        RENSÉ
      </Link>
      <button
        type="button"
        className="press relative grid size-11 place-items-center"
        aria-label="Open bag"
        onClick={() => openBag(true)}
      >
        <ShoppingBag className="size-5 text-gold" strokeWidth={1.25} aria-hidden="true" />
        {qty > 0 && (
          <span className="absolute top-1.5 right-1.5 font-serif text-[11px] text-gold tabular-nums">{qty}</span>
        )}
      </button>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-7 px-6 py-8 sm:grid-cols-3 sm:gap-10 sm:py-12">
        <div>
          <p className="font-display text-2xl tracking-word text-ink">RENSÉ</p>
          <p className="mt-1.5 text-base text-mute">A private transformation</p>
        </div>
        <div>
          <p className="text-xs tracking-label text-gold uppercase">Rensé Advisory</p>
          <p className="mt-2 font-serif text-lg leading-snug text-ink">
            Brommavägen 7
            <br />
            Sweden
          </p>
          <a
            href="mailto:hello@rense.se"
            className="mt-2 inline-block font-serif text-lg text-ink underline decoration-ink/30 underline-offset-4"
          >
            hello@rense.se
          </a>
        </div>
        <div>
          <p className="text-xs tracking-label text-gold uppercase">Delivery</p>
          <p className="mt-2 font-serif text-lg text-ink">Sweden, 1–4 business days</p>
          <p className="mt-1 font-serif text-lg text-ink">Europe, 2–7 business days</p>
          <Link
            to="/returns"
            className="mt-3 block font-serif text-lg text-ink underline decoration-ink/30 underline-offset-4"
          >
            Refund policy
          </Link>
          <Link
            to="/privacy"
            className="mt-1.5 block font-serif text-lg text-ink underline decoration-ink/30 underline-offset-4"
          >
            Privacy notice
          </Link>
        </div>
      </div>
      <div className="border-t border-ink/10 py-6">
        <PayMarks />
      </div>
    </footer>
  );
}

export function PayMarks({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-5 flex flex-col items-center gap-2 ${className}`}>
      <p className="text-sm text-mute">Secure payment</p>
      <div className="flex items-center justify-center gap-1.5" aria-label="Apple Pay, Visa, Mastercard and American Express">
        <ApplePay />
        <Visa />
        <Mastercard />
        <Amex />
      </div>
    </div>
  );
}

const STEPS = [
  "Pick a situation that happened in your life",
  "Answer the questions concerning that situation",
  <>
    Start using the new way <span className="underline underline-offset-2">you</span> discover answering the questions
  </>,
];

export function Steps() {
  return (
    <section className="relative mx-auto mt-10 w-full max-w-3xl px-5" aria-label="How it works">
      <h2 className="mb-6 text-center font-display text-3xl text-ink">How it works</h2>
      <div className="pointer-events-none absolute inset-x-8 top-2 h-24 rounded-full bg-[#f3ddd8]/50 blur-3xl" aria-hidden="true" />
      <ol className="relative grid grid-cols-3 gap-2 sm:gap-4">
        {STEPS.map((step, index) => (
          <li
            key={index}
            className="flex aspect-square flex-col items-center rounded-[1.15rem] border border-white/60 bg-white/35 px-1.5 pt-2.5 pb-2 text-center text-ink shadow-[0_10px_28px_rgba(90,70,40,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md backdrop-saturate-150 sm:rounded-[1.6rem] sm:px-4 sm:pt-6 sm:pb-4"
          >
            <span className="font-display text-[1.35rem] leading-none text-gold sm:text-4xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mt-1 block h-px w-4 bg-gold/50 sm:mt-3 sm:w-8" />
            <p className="mt-4 px-0.5 font-serif text-[12px] leading-[1.15] text-[#4a433c] sm:mt-6 sm:text-lg sm:leading-snug">
              {step}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ApplePay() {
  return (
    <span className="inline-flex h-[22px] items-center gap-1 rounded-[4px] bg-black px-1.5 text-white">
      <svg viewBox="0 0 14 16" className="h-3 w-2.5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M11.2 8.4c0-1.7 1.4-2.5 1.5-2.6-.8-1.2-2.1-1.3-2.5-1.4-1.1-.1-2.1.6-2.6.6s-1.4-.6-2.3-.6c-1.2 0-2.3.7-2.9 1.8-1.2 2.1-.3 5.3.9 7 .6.8 1.3 1.8 2.2 1.7.9 0 1.2-.6 2.3-.6s1.4.6 2.3.6 1.5-.8 2.1-1.7c.7-.9 1-1.9 1-1.9s-1.9-.7-1.9-2.9zM9.4 3.2c.5-.6.8-1.4.7-2.2-.7 0-1.5.5-2 .1-.5.6-.9 1.4-.8 2.2.8.1 1.6-.4 2.1-1.1z"
        />
      </svg>
      <span className="text-[11px] leading-none font-medium tracking-tight">Pay</span>
    </span>
  );
}

function Visa() {
  return (
    <span className="inline-flex h-[22px] w-9 items-center justify-center rounded-[4px] bg-[#1a1f71] text-[11px] font-bold tracking-tight text-white italic">
      VISA
    </span>
  );
}

function Mastercard() {
  return (
    <span className="inline-flex h-[22px] w-9 items-center justify-center rounded-[4px] bg-white ring-1 ring-ink/15">
      <svg viewBox="0 0 36 22" className="h-4 w-7" aria-hidden="true">
        <circle cx="14" cy="11" r="7" fill="#eb001b" />
        <circle cx="22" cy="11" r="7" fill="#f79e1b" />
        <path d="M18 5.8a7 7 0 0 1 0 10.4 7 7 0 0 1 0-10.4z" fill="#ff5f00" />
      </svg>
    </span>
  );
}

function Amex() {
  return (
    <span className="inline-flex h-[22px] items-center rounded-[4px] bg-[#2e77bc] px-1.5 text-[9px] font-bold tracking-tight text-white">
      AMEX
    </span>
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
