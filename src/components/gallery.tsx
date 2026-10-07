import { useEffect, useRef, useState, type PointerEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export const looks = [
  {
    src: "/images/journal-cover-clear.jpg",
    label: "The cover",
    alt: "Guided Healing Journal standing beside a candle, a singing bowl, and dried petals.",
  },
  {
    src: "/images/inside-pages.jpg",
    label: "Inside",
    alt: "The journal open to the feelings wheel and a page titled New Event.",
  },
  {
    src: "/images/cover.jpg",
    label: "The painting",
    alt: "Close view of the watercolor peony, ranunculus, and violet on the journal cover.",
  },
] as const;

export function Gallery({
  openIndex,
  onClose,
}: {
  openIndex: number | null;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [drag, setDrag] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);
  const total = looks.length;
  const look = looks[current] ?? looks[0];

  useEffect(() => {
    if (openIndex !== null) setCurrent(openIndex);
  }, [openIndex]);

  function go(direction: 1 | -1) {
    setDrag(0);
    setCurrent((value) => (value + direction + total) % total);
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    dragging.current = true;
    startX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!dragging.current) return;
    const delta = event.clientX - startX.current;
    setDrag(Math.max(-160, Math.min(160, delta)));
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    const delta = event.clientX - startX.current;
    if (delta <= -48) go(1);
    else if (delta >= 48) go(-1);
    else setDrag(0);
  }

  return (
    <Dialog.Root open={openIndex !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="veil fixed inset-0 z-50 bg-ink" />
        <Dialog.Content
          className="stage fixed inset-0 z-50 flex flex-col bg-ink outline-none"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") go(1);
            if (event.key === "ArrowLeft") go(-1);
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <Dialog.Title className="text-xs tracking-label text-ivory uppercase">
              Guided Healing Journal
            </Dialog.Title>
            <Dialog.Close
              className="press grid size-11 place-items-center text-ivory"
              aria-label="Close images"
            >
              <X className="size-5" strokeWidth={1.25} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            {look.label}. Image {current + 1} of {total}. Swipe or use the arrows.
          </Dialog.Description>

          <div className="relative min-h-0 flex-1">
            <div
              className="absolute inset-0 flex items-center justify-center px-14 sm:px-24"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                dragging.current = false;
                setDrag(0);
              }}
            >
              {looks.map((item, index) => (
                <img
                  key={item.src}
                  src={item.src}
                  alt={index === current ? item.alt : ""}
                  width={1200}
                  height={1600}
                  draggable={false}
                  className={`max-h-full max-w-full object-contain select-none ${
                    index === current ? "relative" : "pointer-events-none absolute opacity-0"
                  }`}
                  style={
                    index === current && drag !== 0
                      ? { transform: `translateX(${drag}px)` }
                      : undefined
                  }
                />
              ))}
            </div>
            <button
              type="button"
              className="press absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 text-ivory sm:left-6"
              onClick={() => go(-1)}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" strokeWidth={1.25} />
            </button>
            <button
              type="button"
              className="press absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 text-ivory sm:right-6"
              onClick={() => go(1)}
              aria-label="Next image"
            >
              <ChevronRight className="size-5" strokeWidth={1.25} />
            </button>
          </div>

          <p className="pt-4 text-center text-xs tracking-label text-gold uppercase">{look.label}</p>
          <div className="flex items-end justify-center gap-4 px-6 pt-4 pb-6">
            {looks.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={item.label}
                aria-current={index === current}
                className="press w-11"
              >
                <img
                  src={item.src}
                  alt=""
                  className={`h-14 w-11 object-cover ${index === current ? "opacity-100" : "opacity-40"}`}
                />
                <span
                  className={`mt-2 block h-px ${index === current ? "bg-gold" : "bg-transparent"}`}
                />
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
