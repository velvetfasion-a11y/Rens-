import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatPrice, JOURNAL } from "@/data/journal";
import { useAtelier } from "@/lib/atelier";

export function BagDialog() {
  const open = useAtelier((state) => state.bagOpen);
  const setOpen = useAtelier((state) => state.setBagOpen);
  const qty = useAtelier((state) => state.qty);
  const setQty = useAtelier((state) => state.setQty);
  const setPayOpen = useAtelier((state) => state.setPayOpen);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="veil fixed inset-0 z-50 bg-ink/70" />
        <Dialog.Content className="bag fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-ink outline-none">
          <div className="flex items-center justify-between px-6 py-5">
            <Dialog.Title className="font-display text-3xl text-ivory">Your bag</Dialog.Title>
            <Dialog.Close className="press grid size-11 place-items-center text-ivory" aria-label="Close bag">
              <X className="size-5" strokeWidth={1.25} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            The Guided Healing Journal in your bag.
          </Dialog.Description>

          <div className="flex-1 px-6">
            {qty === 0 ? (
              <p className="border-t border-ivory/15 pt-8 text-lg text-ivory">Your bag is empty.</p>
            ) : (
              <div className="border-t border-ivory/15 pt-6">
                <div className="flex gap-4">
                  <img
                    src="/images/journal-cover-clear.jpg"
                    alt=""
                    width={1200}
                    height={1600}
                    className="h-28 w-20 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-lg text-ivory">{JOURNAL.name}</p>
                    <p className="mt-1 text-base text-mute tabular-nums">{formatPrice(JOURNAL.price)}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-mute">Quantity</span>
                  <div className="flex items-center border border-ivory/20">
                    <button
                      type="button"
                      className="press grid size-11 place-items-center text-ivory"
                      onClick={() => setQty(qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-4" strokeWidth={1.25} />
                    </button>
                    <span className="w-8 text-center text-base text-ivory tabular-nums">{qty}</span>
                    <button
                      type="button"
                      className="press grid size-11 place-items-center text-ivory"
                      onClick={() => setQty(qty + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-4" strokeWidth={1.25} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 pt-4 pb-6">
            <div className="flex items-baseline justify-between border-t border-ivory/15 py-5">
              <span className="text-sm text-mute">Total</span>
              <span className="font-display text-3xl text-ivory tabular-nums">
                {formatPrice(JOURNAL.price * qty)}
              </span>
            </div>
            <button
              type="button"
              className="press h-12 w-full bg-ivory text-sm text-ink"
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
              <p className="mt-4 text-center text-sm text-mute">
                Secure checkout with Stripe
              </p>
            ) : null}
            <Link
              to="/returns"
              onClick={() => setOpen(false)}
              className="mt-3 block text-center text-sm text-ivory underline underline-offset-4"
            >
              14-day refund
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
