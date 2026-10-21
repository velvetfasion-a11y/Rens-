import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatPrice, JOURNAL } from "@/data/journal";
import { useAtelier } from "@/lib/atelier";

const JOURNAL_IMAGE = "/images/journal-real.jpg";

export function BagDialog() {
  const open = useAtelier((state) => state.bagOpen);
  const setOpen = useAtelier((state) => state.setBagOpen);
  const qty = useAtelier((state) => state.qty);
  const setQty = useAtelier((state) => state.setQty);
  const setPayOpen = useAtelier((state) => state.setPayOpen);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="veil fixed inset-0 z-50 bg-black/65" />
        <Dialog.Content className="bag fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-ink/15 bg-white outline-none">
          <div className="flex items-center justify-between px-6 py-5">
            <Dialog.Title className="font-display text-3xl text-ink">Your bag</Dialog.Title>
            <Dialog.Close className="press grid size-11 place-items-center text-ink" aria-label="Close bag">
              <X className="size-5" strokeWidth={1.25} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            The Guided Healing Journal in your bag.
          </Dialog.Description>

          <div className="flex-1 px-6">
            {qty === 0 ? (
              <p className="border-t border-ink/15 pt-8 text-lg text-mute italic">Your bag is empty.</p>
            ) : (
              <div className="border-t border-ink/15 pt-5">
                <div className="flex gap-4">
                  <img
                    src={JOURNAL_IMAGE}
                    alt=""
                    width={842}
                    height={1289}
                    className="h-28 w-20 object-cover object-center"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl text-ink">{JOURNAL.name}</p>
                    <p className="mt-1 text-sm text-mute italic">A private transformation</p>
                    <p className="mt-3 font-display text-2xl text-ink tabular-nums">{formatPrice(JOURNAL.price)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    className="press grid size-11 place-items-center rounded-full border border-ink/30 text-ink"
                    onClick={() => setQty(qty - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-4" strokeWidth={1.25} />
                  </button>
                  <span className="w-6 text-center font-serif tabular-nums text-ink">{qty}</span>
                  <button
                    type="button"
                    className="press grid size-11 place-items-center rounded-full border border-ink/30 text-ink"
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-4" strokeWidth={1.25} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-ink/15 px-6 py-6">
            <div className="flex items-baseline justify-between">
              <span className="text-xs tracking-label text-gold uppercase">Subtotal</span>
              <span className="font-display text-3xl text-ink tabular-nums">
                {formatPrice(JOURNAL.price * qty)}
              </span>
            </div>
            <button
              type="button"
              className="press mt-5 flex h-12 w-full items-center justify-center rounded-full border border-gold text-xs tracking-label text-ink uppercase"
              onClick={() => {
                if (qty === 0) {
                  setOpen(false);
                  return;
                }
                setOpen(false);
                setPayOpen(true);
              }}
            >
              {qty === 0 ? "Return" : "Continue to payment"}
            </button>
            {qty > 0 ? (
              <p className="mt-3 text-center text-sm text-mute italic">Secure checkout with Stripe</p>
            ) : null}
            <Link
              to="/returns"
              onClick={() => setOpen(false)}
              className="mt-3 block text-center font-serif text-sm text-ink underline decoration-ink/30 underline-offset-4"
            >
              14-day refund
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
