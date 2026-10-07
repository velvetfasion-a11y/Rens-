import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { formatPrice, JOURNAL, reviews } from "@/data/journal";
import { useAtelier } from "@/lib/atelier";
import { Stars } from "@/components/stars";
import { Gallery } from "@/components/gallery";

const facts = [
  {
    title: "Sanctuary",
    body: "A home should be a sanctuary. A place to reset, to heal, and to come to a higher vibration.",
  },
  {
    title: "Our vision",
    body: "To make every home a luxury sanctuary, kept for healing and cleansing, both your inner world and the outer. We curate the best so you can truly get the best transformation.",
  },
];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function ReviewSlides() {
  const count = reviews.length;
  const slides = [...reviews, reviews[0]];
  const [pos, setPos] = useState(0);
  const [paused, setPaused] = useState(false);
  const [motionOk, setMotionOk] = useState(true);
  const [instant, setInstant] = useState(false);
  const index = pos % count;
  const review = reviews[index] ?? reviews[0];
  const step = 100 / slides.length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotionOk(!media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!instant) return;
    const frame = window.requestAnimationFrame(() => setInstant(false));
    return () => window.cancelAnimationFrame(frame);
  }, [instant]);

  useEffect(() => {
    if (!motionOk || paused) return;
    const timer = window.setTimeout(() => {
      setPos((current) => current + 1);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [pos, motionOk, paused]);

  function go(direction: 1 | -1) {
    if (direction === -1 && pos % count === 0) {
      setInstant(true);
      setPos(count - 1);
      return;
    }
    setInstant(false);
    setPos((current) => current + direction);
  }

  function onTransitionEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (event.propertyName !== "transform" || event.target !== event.currentTarget) return;
    if (pos !== count) return;
    setInstant(true);
    setPos(0);
  }

  return (
    <div
      className="mt-6 border-t border-ivory/15 pt-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Reviews"
    >
      <div className="min-w-0 overflow-hidden">
        <div
          className="flex [backface-visibility:hidden]"
          onTransitionEnd={onTransitionEnd}
          style={{
            width: `${slides.length * 100}%`,
            transform: `translate3d(-${pos * step}%, 0, 0)`,
            transition: !motionOk || instant ? "none" : "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {slides.map((item, itemIndex) => (
            <article
              key={`${item.id}-${itemIndex}`}
              className="min-w-0"
              style={{ flex: `0 0 ${step}%` }}
              aria-hidden={itemIndex !== pos}
            >
              <h3 className="font-display text-xl text-ivory">{item.name}</h3>
              {item.place ? <p className="mt-0.5 text-sm text-mute italic">{item.place}</p> : null}
              <span className="mt-2 inline-flex">
                <Stars />
              </span>
              <p className="mt-3 text-lg leading-snug text-ivory italic">“{item.quote}”</p>
            </article>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {review.name}, {review.place}. {review.quote}
      </p>
      <div className="mt-3 flex items-center justify-center gap-3 lg:justify-start">
        <button
          type="button"
          className="press grid size-9 place-items-center text-ivory"
          onClick={() => go(-1)}
          aria-label="Previous review"
        >
          <ChevronLeft className="size-4" strokeWidth={1.25} />
        </button>
        <p className="text-xs tracking-widest text-mute tabular-nums">
          {pad(index + 1)}
          <span className="px-2 text-ivory/30">/</span>
          {pad(count)}
        </p>
        <button
          type="button"
          className="press grid size-9 place-items-center text-ivory"
          onClick={() => go(1)}
          aria-label="Next review"
        >
          <ChevronRight className="size-4" strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
}

export function Product() {
  const add = useAtelier((state) => state.add);
  const saved = useAtelier((state) => state.saved);
  const toggleSaved = useAtelier((state) => state.toggleSaved);
  const [look, setLook] = useState<number | null>(null);

  return (
    <section id="journal" className="bg-ink">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <div className="relative mx-auto w-full max-w-xl">
          <button
            type="button"
            onClick={() => setLook(0)}
            className="press group frame-journal relative w-full cursor-zoom-in overflow-hidden"
            aria-label="View the journal images"
          >
            <img
              src="/images/journal-cover-clear.jpg"
              alt="Guided Healing Journal standing beside a candle, a singing bowl, and dried petals."
              width={1180}
              height={1574}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </button>
        </div>

        <div className="mx-auto w-full min-w-0 max-w-md lg:mx-0 lg:max-w-lg">
          <div className="text-center lg:text-left">
            <p className="text-xs tracking-label text-gold uppercase">The journal</p>
            <h2 className="mt-4 text-4xl text-ivory sm:text-5xl">{JOURNAL.name}</h2>
            <p className="mt-6 text-sm text-mute italic">
              For pain, and for the patterns you are ready to set down.
            </p>
            <p className="mt-6 font-display text-4xl text-ivory tabular-nums">{formatPrice(JOURNAL.price)}</p>

            <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
              <button
                type="button"
                onClick={add}
                className="press h-12 min-w-44 rounded-full border border-gold px-8 text-xs tracking-label text-ivory uppercase"
              >
                Add to bag
              </button>
              <button
                type="button"
                onClick={toggleSaved}
                aria-pressed={saved}
                aria-label={saved ? "Remove from saved" : "Save this journal"}
                className="press grid size-12 place-items-center rounded-full border border-ivory/30 text-ivory"
              >
                <Heart
                  className={saved ? "size-5 fill-gold text-gold" : "size-5 fill-transparent text-ivory"}
                  strokeWidth={1.25}
                />
              </button>
            </div>
            <ReviewSlides />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setLook(2)}
        className="group relative block h-64 w-full cursor-zoom-in overflow-hidden sm:h-80 lg:h-96"
        aria-label="View the painting"
      >
        <img
          src="/images/cover.jpg"
          alt="Close view of the watercolor peony, ranunculus, and violet on the journal cover."
          width={1500}
          height={2000}
          decoding="async"
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
      </button>

      <ul className="mx-auto grid max-w-6xl sm:grid-cols-2">
        {facts.map((fact) => (
          <li key={fact.title} className="border-t border-ivory/15 px-6 py-8 sm:px-8">
            <p className="text-xs tracking-label text-gold uppercase">{fact.title}</p>
            <p className="mt-3 text-lg text-ivory">{fact.body}</p>
          </li>
        ))}
      </ul>
      <Gallery openIndex={look} onClose={() => setLook(null)} />
    </section>
  );
}
