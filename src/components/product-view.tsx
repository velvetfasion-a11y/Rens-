import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { PayMarks, Steps } from "@/components/site-chrome";
import { REVIEWS } from "@/data/reviews";
import { JOURNAL } from "@/data/journal";
import { useAtelier } from "@/lib/atelier";

const IMAGES = [
  {
    src: "/images/journal-real.jpg",
    alt: "The Guided Healing Journal, a pale cover with watercolor peonies and lilac.",
  },
  {
    src: "/images/journal-welcome-2.jpg",
    alt: "The welcome page of the journal, open on marble.",
  },
  {
    src: "/images/journal-pages-2.jpg",
    alt: "A lined journal page titled New Event, with space to write what happened.",
  },
  {
    src: "/images/cover.jpg",
    alt: "Close view of the watercolor peony, ranunculus, and violet on the journal cover.",
  },
] as const;

export function ProductView({ bagLabel }: { bagLabel: string }) {
  const add = useAtelier((s) => s.add);
  const [review, setReview] = useState(0);

  return (
    <section
      id="product"
      className="scroll-mt-16 bg-white pb-10 lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:px-10"
    >
      <Gallery />
      <div className="mx-auto w-full max-w-md px-5 pt-8 text-center lg:mx-0 lg:max-w-none lg:px-0 lg:pt-0 lg:text-left">
        <p className="font-display text-3xl text-ink tabular-nums">{JOURNAL.price} kr</p>
        <p className="mx-auto mt-3 max-w-xs font-serif text-lg leading-snug text-mute italic lg:mx-0 lg:max-w-sm">
          A guided journal, to break patterns, and live a better life.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-mute uppercase">
          <span className="inline-flex gap-0.5 text-gold" aria-hidden="true">
            {Array.from({ length: 5 }, (_, star) => (
              <Star key={star} className="size-3 fill-gold" strokeWidth={0} />
            ))}
          </span>
          {REVIEWS.length} reviews
        </p>
        <div className="mt-4 flex justify-center lg:justify-start">
          <button
            type="button"
            className="press h-12 min-w-52 rounded-full border border-gold px-8 text-[11px] tracking-label text-ink uppercase"
            onClick={add}
          >
            {bagLabel}
          </button>
        </div>
        <p className="mt-4 text-[13px] tracking-wide text-mute">
          <Link to="/returns" className="underline decoration-gold/60 underline-offset-4">
            30-day returns
          </Link>
          <span className="mx-2 text-gold" aria-hidden="true">
            ·
          </span>
          Ships in 1–7 days
        </p>
        <PayMarks className="lg:items-start" />
      </div>
      <div className="lg:col-span-2">
        <Steps />
      </div>
      <div className="lg:col-span-2">
        <Reviews index={review} setIndex={setReview} />
        <div className="mx-auto w-full max-w-md px-5 pb-4 text-center">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Is this you?</p>
          <ul className="mt-4 space-y-3 font-serif text-xl leading-snug text-ink">
            <li>Not seeing growth in your life?</li>
            <li>Stuck with limiting beliefs?</li>
            <li>Desire a better life?</li>
          </ul>
          <button
            type="button"
            className="press mt-8 h-12 min-w-52 rounded-full border border-gold px-8 text-[11px] tracking-label text-ink uppercase"
            onClick={add}
          >
            {bagLabel}
          </button>
          <p className="mt-4 text-[13px] tracking-wide text-mute">
            <Link to="/returns" className="underline decoration-gold/60 underline-offset-4">
              30-day returns
            </Link>
            <span className="mx-2 text-gold" aria-hidden="true">
              ·
            </span>
            Ships in 1–7 days
          </p>
          <PayMarks />
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const go = (next: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="bg-white pt-4 lg:pt-0">
      <div className="relative">
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => go((index - 1 + IMAGES.length) % IMAGES.length)}
          className="absolute top-1/2 left-1 z-10 hidden size-11 -translate-y-1/2 place-items-center text-ink lg:grid"
        >
          <ChevronLeft className="size-7" strokeWidth={1} />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={() => go((index + 1) % IMAGES.length)}
          className="absolute top-1/2 right-1 z-10 hidden size-11 -translate-y-1/2 place-items-center text-ink lg:grid"
        >
          <ChevronRight className="size-7" strokeWidth={1} />
        </button>
        <div
          ref={scroller}
          onScroll={(event) => {
            const el = event.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {IMAGES.map((item, imageIndex) => (
            <div
              key={item.src}
              className="relative aspect-square w-full shrink-0 snap-center overflow-hidden bg-white lg:aspect-4/5"
            >
              <img
                src={item.src}
                alt={item.alt}
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain p-10 sm:p-16 lg:p-12"
              />
              {imageIndex === 0 && (
                <div className="pointer-events-none absolute inset-10 flex items-center justify-center sm:inset-16 lg:inset-12">
                  <div className="relative h-full aspect-[842/1289]">
                    <span className="absolute -top-6 -left-7 block size-28">
                      <img
                        src="/images/limited-seal.png?v=5"
                        alt="Limited edition"
                        className="h-auto w-full"
                        draggable={false}
                      />
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 mt-1 flex justify-center gap-2">
        {IMAGES.map((item, imageIndex) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Show image ${imageIndex + 1}`}
            onClick={() => go(imageIndex)}
            className={`h-0.5 w-6 ${imageIndex === index ? "bg-ink" : "bg-ink/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

function Reviews({ index, setIndex }: { index: number; setIndex: Dispatch<SetStateAction<number>> }) {
  const step = (dir: number) => setIndex((i) => (i + dir + REVIEWS.length) % REVIEWS.length);
  const item = REVIEWS[index];

  useEffect(() => {
    const id = window.setInterval(() => step(1), 10000);
    return () => window.clearInterval(id);
  }, [index]);

  return (
    <section className="bg-white px-5 py-10" aria-label="Reviews">
      <h2 className="mb-6 text-center font-display text-3xl text-ink">Reviews</h2>
      <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
        <button
          type="button"
          className="press absolute left-0 z-10 grid size-9 place-items-center text-ink"
          aria-label="Previous review"
          onClick={() => step(-1)}
        >
          <ChevronLeft className="size-5" strokeWidth={1.5} />
        </button>
        <article className="mx-9 flex min-h-72 w-full flex-col items-center justify-center rounded-[1.35rem] bg-white px-6 py-8 text-center shadow-[0_16px_40px_rgba(12,10,9,0.12)]">
          <span className="inline-flex gap-1 text-gold" aria-hidden="true">
            {Array.from({ length: 5 }, (_, star) => (
              <Star key={star} className="size-5 fill-gold" strokeWidth={0} />
            ))}
          </span>
          <p className="mt-5 font-sans text-[15px] leading-relaxed text-ink">{item.quote}</p>
          <p className="mt-6 text-base font-semibold text-ink">{item.name}</p>
          <p className="mt-1 text-sm text-mute">{item.city}</p>
        </article>
        <button
          type="button"
          className="press absolute right-0 z-10 grid size-9 place-items-center text-ink"
          aria-label="Next review"
          onClick={() => step(1)}
        >
          <ChevronRight className="size-5" strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
