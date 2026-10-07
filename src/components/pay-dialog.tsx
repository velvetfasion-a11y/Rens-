import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { formatPrice, JOURNAL, shippingCost, shippingDays, type ShipRegion } from "@/data/journal";
import { useAtelier } from "@/lib/atelier";
import { createStripeCheckout, methods, type OrderInput } from "@/lib/orders";

type Method = OrderInput["method"];

function AppleMark({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${light ? "text-white" : "text-black"}`}>
      <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden>
        <path
          fill="currentColor"
          d="M16.37 12.72c-.03-2.35 1.92-3.48 2.01-3.54-1.1-1.6-2.8-1.82-3.4-1.84-1.45-.15-2.83.85-3.56.85-.74 0-1.87-.83-3.08-.81-1.58.02-3.05.92-3.86 2.34-1.65 2.86-.42 7.09 1.18 9.41.79 1.14 1.72 2.41 2.95 2.37 1.18-.05 1.63-.76 3.06-.76 1.42 0 1.83.76 3.08.74 1.27-.02 2.08-1.16 2.86-2.3.9-1.31 1.27-2.58 1.29-2.65-.03-.01-2.47-.95-2.5-3.76zM14.7 6.3c.64-.78 1.08-1.86.96-2.94-.93.04-2.05.62-2.72 1.4-.6.69-1.12 1.8-.98 2.86 1.04.08 2.1-.53 2.74-1.32z"
        />
      </svg>
      <span className="text-sm font-medium">Pay</span>
    </span>
  );
}

function MastercardMark() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-9" aria-hidden>
      <circle cx="14" cy="12" r="8" fill="#EB001B" />
      <circle cx="24" cy="12" r="8" fill="#F79E1B" />
      <path d="M19 6.2a8 8 0 0 1 0 11.6 8 8 0 0 1 0-11.6z" fill="#FF5F00" />
    </svg>
  );
}

function PaypalMark() {
  return (
    <span className="text-lg font-bold leading-none tracking-tight">
      <span style={{ color: "#003087" }}>Pay</span>
      <span style={{ color: "#009cde" }}>Pal</span>
    </span>
  );
}

function KlarnaMark() {
  return <span className="text-base font-bold tracking-tight text-black">Klarna</span>;
}

export function PayDialog() {
  const open = useAtelier((state) => state.payOpen);
  const setOpen = useAtelier((state) => state.setPayOpen);
  const qty = useAtelier((state) => state.qty);
  const [method, setMethod] = useState<Method>("card");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState<ShipRegion>("");
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);

  const goods = JOURNAL.price * qty;
  const addressReady = Boolean(address.trim() && postal.trim() && city.trim() && country);
  const delivery = addressReady ? shippingCost(qty, country) : null;
  const due = goods + (delivery ?? 0);
  const days = addressReady ? shippingDays(country) : null;

  function close(next: boolean) {
    setOpen(next);
    if (!next) {
      setError("");
      setAgreed(false);
    }
  }

  function pay() {
    if (!email.includes("@") || !email.includes(".")) {
      setError("Enter an email address.");
      return;
    }
    if (!fullName.trim() || !address.trim() || !postal.trim() || !city.trim() || !country) {
      setError("Enter the name and the address for delivery.");
      return;
    }
    if (!agreed) {
      setError("Agree to the copyright terms to purchase.");
      return;
    }
    setSending(true);
    setError("");
    void createStripeCheckout({
      data: {
        name: fullName,
        email,
        address,
        postal,
        city,
        country,
        qty,
        method,
      },
    })
      .then(({ url }) => {
        window.location.href = url;
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "The checkout could not be started. Try again.");
        setSending(false);
      });
  }

  return (
    <Dialog.Root open={open} onOpenChange={close}>
      <Dialog.Portal>
        <Dialog.Overlay className="veil fixed inset-0 z-50 bg-ink/70" />
        <Dialog.Content className="pay-sheet bag fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col outline-none">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <Dialog.Title className="text-lg font-semibold text-neutral-900">Payment</Dialog.Title>
            <Dialog.Close
              className="press grid size-10 place-items-center text-neutral-900"
              aria-label="Close payment"
            >
              <X className="size-5" strokeWidth={1.5} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Pay for the Guided Healing Journal with Stripe Checkout. Card details are entered on Stripe, not on this site.
          </Dialog.Description>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
              <img src="/images/journal-cover-clear.jpg" alt="" className="h-14 w-10 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900">{JOURNAL.name}</p>
                <p className="mt-0.5 text-sm text-neutral-500 tabular-nums">Qty {qty}</p>
              </div>
              <p className="text-sm font-medium text-neutral-900 tabular-nums">{formatPrice(goods)}</p>
            </div>

            <p className="mt-5 text-sm font-medium text-neutral-900">Preferred payment</p>
            <p className="mt-1 text-xs text-neutral-500">You will complete payment securely on Stripe.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MethodTile method="apple" current={method} onSelect={setMethod} label="Apple Pay">
                <AppleMark light />
              </MethodTile>
              <MethodTile method="card" current={method} onSelect={setMethod} label="Mastercard">
                <span className="inline-flex items-center gap-2">
                  <MastercardMark />
                  <span className="text-xs font-semibold text-neutral-800">mastercard</span>
                </span>
              </MethodTile>
              <MethodTile method="paypal" current={method} onSelect={setMethod} label="PayPal">
                <PaypalMark />
              </MethodTile>
              <MethodTile method="klarna" current={method} onSelect={setMethod} label="Klarna" className="bg-[#FFB3C7]">
                <KlarnaMark />
              </MethodTile>
            </div>

            <p className="mt-6 text-sm font-medium text-neutral-900">Delivery</p>
            <div className="mt-3">
              <Field label="Email" value={email} onChange={setEmail} autoComplete="email" type="email" />
              <Field label="Full name" value={fullName} onChange={setFullName} autoComplete="name" />
              <Field label="Address" value={address} onChange={setAddress} autoComplete="street-address" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Postcode" value={postal} onChange={setPostal} autoComplete="postal-code" />
                <Field label="City" value={city} onChange={setCity} autoComplete="address-level2" />
              </div>
              <label className="mt-3 block">
                <span className="text-xs font-medium text-neutral-600">Country</span>
                <select
                  value={country}
                  autoComplete="country-name"
                  onChange={(event) => setCountry(event.target.value as ShipRegion)}
                  className="pay-field mt-1"
                >
                  <option value="">Select</option>
                  <option value="sweden">Sweden</option>
                  <option value="europe">Europe</option>
                  <option value="world">Outside Europe</option>
                </select>
              </label>
              {addressReady && delivery !== null ? (
                <div className="mt-5 border border-neutral-200 px-4 py-3 text-sm text-neutral-900">
                  <div className="flex justify-between gap-4">
                    <span>Journal</span>
                    <span className="tabular-nums">{formatPrice(goods)}</span>
                  </div>
                  <div className="mt-2 flex justify-between gap-4">
                    <span>Delivery</span>
                    <span className="tabular-nums">{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
                  </div>
                  {days ? <p className="mt-2 text-neutral-500">{days}</p> : null}
                  <div className="mt-3 flex justify-between gap-4 border-t border-neutral-200 pt-3 font-medium">
                    <span>Total</span>
                    <span className="tabular-nums">{formatPrice(due)}</span>
                  </div>
                </div>
              ) : null}
            </div>
            {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
          </div>

          <div className="border-t border-neutral-200 px-5 py-4">
            <label className="mb-4 flex items-start gap-3 text-sm text-neutral-800">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-0.5 size-4 accent-neutral-950"
              />
              <span>
                I agree to the{" "}
                <a href="/copyright" target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  copyright terms
                </a>{" "}
                and the{" "}
                <a href="/privacy" target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  privacy notice
                </a>
                .
              </span>
            </label>
            <button
              type="button"
              onClick={pay}
              disabled={sending}
              className="press flex h-12 w-full items-center justify-center rounded-md bg-neutral-950 text-sm font-medium text-white disabled:opacity-50"
            >
              {sending ? "Opening checkout…" : `Continue to checkout · ${formatPrice(addressReady ? due : goods)}`}
            </button>
            <p className="mt-3 text-center text-xs text-neutral-500">
              Preferred: {methods[method]}. Payment is handled by Stripe.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MethodTile({
  method,
  current,
  onSelect,
  label,
  children,
  className = "",
}: {
  method: Method;
  current: Method;
  onSelect: (method: Method) => void;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={current === method}
      aria-label={label}
      onClick={() => onSelect(method)}
      className={`pay-tile press ${method === "apple" ? "pay-tile--apple" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  autoComplete,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  type?: string;
}) {
  const id = `pay-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <label htmlFor={id} className="mt-3 block">
      <span className="text-xs font-medium text-neutral-600">{label}</span>
      <input
        id={id}
        value={value}
        type={type}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="pay-field mt-1"
      />
    </label>
  );
}
