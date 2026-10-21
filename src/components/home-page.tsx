import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { REVIEWS } from "@/data/reviews";
import { JOURNAL } from "@/data/journal";
import { useAtelier } from "@/lib/atelier";
import { SaveButton, SiteChrome } from "@/components/site-chrome";

const INSIDE = [
  ["Welcome", "page"],
  ["Feelings", "wheel"],
  ["Guided", "questions"],
] as const;

const GALLERY = [
  {
    src: "/images/journal-real.jpg",
    alt: "The Guided Healing Journal, a pale cover with watercolor peonies and lilac.",
    width: 842,
    height: 1289,
  },
  {
    src: "/images/cover.jpg",
    alt: "Close view of the watercolor peony, ranunculus, and violet on the journal cover.",
    width: 1500,
    height: 2000,
  },
] as const;

export function HomePage() {
  const add = useAtelier((s) => s.add);
  const [review, setReview] = useState(0);
  const [gallery, setGallery] = useState<number | null>(null);

  return (
    <SiteChrome>
      <main>
        <section id="top" className="relative h-[88svh] overflow-hidden bg-white">
          <HeroFilm />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-b from-transparent via-black/20 to-black/65" />
          <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-14 text-left sm:px-10 sm:pb-16">
            <h1 className="max-w-[11ch] text-[2.75rem] leading-[1.02] font-normal text-white italic sm:text-6xl">
              Guided Healing Journal
            </h1>
            <a
              href="#journal"
              className="mt-6 text-[11px] tracking-[0.28em] text-white uppercase underline decoration-white underline-offset-[10px]"
            >
              Get the journal
            </a>
          </div>
        </section>

        <section className="bg-white pt-16">
          <div
            id="journal"
            className="scroll-mt-14 mx-auto grid max-w-6xl items-start gap-6 px-5 pb-2 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-12"
          >
            <button
              type="button"
              className="press flex cursor-zoom-in items-center justify-center bg-white"
              aria-label="View the journal images"
              onClick={() => setGallery(0)}
            >
              <img
                src={GALLERY[0].src}
                alt={GALLERY[0].alt}
                width={GALLERY[0].width}
                height={GALLERY[0].height}
                decoding="async"
                className="mx-auto h-auto w-auto max-h-[52svh] max-w-full object-contain object-center lg:max-h-[780px]"
              />
            </button>
            <div className="mx-auto w-full max-w-md text-center lg:mx-0 lg:max-w-lg lg:pt-8 lg:text-left">
              <p className="text-[11px] tracking-label text-gold uppercase">The journal</p>
              <h2 className="mx-auto mt-3 max-w-[12ch] text-4xl text-ink sm:max-w-none sm:text-5xl lg:mx-0">
                Guided Healing Journal
              </h2>
              <p className="mt-3 font-serif text-lg text-mute italic">
                Not every painful moment is a loss. Some are the beginning of something good.
              </p>
              <p className="mt-4 font-display text-3xl text-ink tabular-nums">{JOURNAL.price} kr</p>
              <div className="mt-4 flex items-center justify-center gap-3 lg:justify-start">
                <button
                  type="button"
                  className="press h-12 min-w-52 rounded-full border border-gold px-8 text-[11px] tracking-label text-ink uppercase"
                  onClick={add}
                >
                  Add to bag
                </button>
                <SaveButton />
              </div>
              <p className="mt-4 text-center text-sm text-mute lg:text-left">Secure payment</p>
              <div className="mt-8 border-t border-ink/15 pt-8">
                <p className="text-center text-[11px] tracking-[0.35em] text-gold uppercase lg:text-left">
                  What’s inside
                </p>
                <ul className="mt-6 grid grid-cols-3">
                  {INSIDE.map(([first, second], i) => (
                    <li
                      key={first}
                      className={`px-1 text-center font-serif text-[17px] leading-snug text-ink ${i ? "border-l border-gold/50" : ""}`}
                    >
                      {first}
                      <br />
                      {second}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <Reviews index={review} setIndex={setReview} />

          <button
            type="button"
            className="group relative block h-64 w-full cursor-zoom-in overflow-hidden sm:h-80 lg:h-96"
            aria-label="View the painting"
            onClick={() => setGallery(1)}
          >
            <img
              src={GALLERY[1].src}
              alt={GALLERY[1].alt}
              width={GALLERY[1].width}
              height={GALLERY[1].height}
              decoding="async"
              loading="lazy"
              className="h-full w-full object-cover object-center"
            />
          </button>

          <section id="about" className="relative overflow-hidden bg-white px-6 pt-16 pb-12 text-center sm:pt-20 lg:pt-24 lg:pb-16">
            <p
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-10 select-none text-center font-display text-[18vw] leading-none tracking-[0.08em] text-ink/[0.045] sm:top-8 sm:text-[14vw] lg:text-[11rem]"
            >
              RENSÉ
            </p>
            <p className="relative flex items-center justify-center gap-4 text-[11px] tracking-[0.42em] text-gold uppercase">
              <span className="h-px w-8 bg-gold sm:w-12" />
              About us
              <span className="h-px w-8 bg-gold sm:w-12" />
            </p>
            <h2 className="relative mx-auto mt-6 text-ink lg:mt-8">
              <span className="block text-[clamp(1.85rem,7.6vw,4.5rem)] leading-[1.08] whitespace-nowrap">
                At RENSÉ, we believe
              </span>
              <span className="block text-[clamp(1.85rem,7.6vw,4.5rem)] leading-[1.08] whitespace-nowrap">
                everything is <span className="text-gold italic">energy.</span>
              </span>
            </h2>
            <span className="relative mx-auto mt-7 block h-px w-12 bg-gold lg:mt-8" />
            <div className="relative mx-auto mt-9 max-w-[34rem] space-y-7 font-serif text-[1.15rem] leading-[1.7] text-[#5c564e] sm:max-w-2xl sm:text-lg lg:mt-10 lg:max-w-3xl lg:space-y-5 lg:text-[1.05rem] lg:leading-relaxed">
              <p>
                The way we feel, the way we speak to ourselves,
                <br className="sm:hidden" /> the spaces we live in: all of it carries a vibration.
                <br className="sm:hidden" /> And we believe many of us carry things we were
                <br className="sm:hidden" /> never given the space to set down.
              </p>
              <p>
                RENSÉ began as a desire to create that space. A
                <br className="sm:hidden" /> quiet place to slow down, listen inward, and meet
                <br className="sm:hidden" /> whatever is there with honesty and kindness. The
                <br className="sm:hidden" /> Guided Healing Journal was our first piece:
                <br className="sm:hidden" /> pages that help you recognise your patterns,
                <br className="sm:hidden" /> name what hurts, and understand the lesson
                <br className="sm:hidden" /> each moment carried, so you can gently let it go.
              </p>
            </div>
            <p className="relative mt-8 inline-block text-[11px] tracking-[0.38em] text-ink uppercase lg:mt-10">
              Read our story <span aria-hidden="true">→</span>
              <span className="mt-2 block h-px w-full bg-gold" />
            </p>
          </section>
        </section>

        <Circle />
      </main>
      {gallery !== null ? (
        <Gallery index={gallery} onClose={() => setGallery(null)} onIndex={setGallery} />
      ) : null}
    </SiteChrome>
  );
}

function Circle() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="bg-[#f6e8e4] px-6 py-14 text-center sm:py-16 lg:py-20">
      <h2 className="text-[2.75rem] leading-[1.05] text-ink sm:text-6xl sm:whitespace-nowrap">
        Join the
        <br className="sm:hidden" /> RENSÉ Circle
      </h2>
      <span className="mx-auto mt-5 block h-px w-12 bg-gold" />
      <p className="mx-auto mt-5 max-w-md font-serif text-lg text-mute italic sm:text-xl">
        Early access and private releases, straight to your inbox.
      </p>
      {done ? (
        <p className="mt-10 text-sm text-mute">You're on the list.</p>
      ) : (
        <form
          className="mx-auto mt-8 flex w-full max-w-md items-center rounded-full bg-white p-1.5 pl-5"
          onSubmit={(event) => {
            event.preventDefault();
            const next = email.trim();
            if (!next.includes("@")) return;
            const saved = JSON.parse(localStorage.getItem("rense-circle") || "[]") as string[];
            localStorage.setItem("rense-circle", JSON.stringify([...saved, next]));
            setDone(true);
          }}
        >
          <input
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            enterKeyHint="done"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email"
            aria-label="Your email"
            className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-[#b0a8a0]"
          />
          <button
            type="submit"
            className="press h-11 shrink-0 rounded-full bg-gold px-7 text-[11px] tracking-[0.22em] text-white uppercase"
          >
            Join
          </button>
        </form>
      )}
      <p className="mt-4 text-xs text-[#a39b93]">No spam. Unsubscribe anytime.</p>
    </section>
  );
}

function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-center"
      src="/video/journal-hero.mp4"
      poster="/images/cover.jpg"
      autoPlay
      muted
      loop
      playsInline
      aria-label="The Guided Healing Journal on marble, light moving across the cover."
    />
  );
}

function Reviews({ index, setIndex }: { index: number; setIndex: (n: number) => void }) {
  const step = (dir: number) => setIndex((index + dir + REVIEWS.length) % REVIEWS.length);
  const item = REVIEWS[index];

  useEffect(() => {
    const id = window.setInterval(() => step(1), 5000);
    return () => window.clearInterval(id);
  }, [index]);

  return (
    <div className="mx-auto max-w-2xl px-6 pt-6 pb-6 text-center" aria-label="Reviews">
      <div className="border-t border-ink/10 pt-8">
        <p className="text-[11px] tracking-label text-gold uppercase">Reviews</p>
        <span className="mt-3 inline-flex gap-1 text-gold" aria-hidden="true">
          {Array.from({ length: 5 }, (_, star) => (
            <Star key={star} className="size-3.5 fill-gold" strokeWidth={0} />
          ))}
        </span>
        <p className="mt-6 flex min-h-[6.5rem] items-center justify-center font-serif text-2xl leading-snug text-ink/75 italic sm:min-h-[5.5rem] sm:text-3xl">
          “{item.quote}”
        </p>
        <p className="mt-6 text-[11px] tracking-[0.22em] text-mute uppercase">
          {item.name} · {item.city}
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            className="press grid size-11 place-items-center text-mute"
            aria-label="Previous review"
            onClick={() => step(-1)}
          >
            <ChevronLeft className="size-4" strokeWidth={1.25} />
          </button>
          <button
            type="button"
            className="press grid size-11 place-items-center text-mute"
            aria-label="Next review"
            onClick={() => step(1)}
          >
            <ChevronRight className="size-4" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Gallery({
  index,
  onClose,
  onIndex,
}: {
  index: number;
  onClose: () => void;
  onIndex: (n: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onIndex]);

  const shot = GALLERY[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 p-4">
      <button type="button" className="absolute inset-0" aria-label="Close images" onClick={onClose} />
      <button
        type="button"
        className="press absolute top-4 right-4 z-10 grid size-11 place-items-center text-ink"
        aria-label="Close images"
        onClick={onClose}
      >
        <X className="size-5" strokeWidth={1.25} />
      </button>
      <button
        type="button"
        className="press absolute left-3 z-10 grid size-11 place-items-center rounded-full border border-ink/30 text-ink"
        aria-label="Previous image"
        onClick={() => onIndex((index - 1 + GALLERY.length) % GALLERY.length)}
      >
        <ChevronLeft className="size-4" />
      </button>
      <img
        src={shot.src}
        alt={shot.alt}
        className="gallery-pop relative z-10 max-h-[86svh] max-w-[80vw] object-contain"
      />
      <button
        type="button"
        className="press absolute right-3 z-10 grid size-11 place-items-center rounded-full border border-ink/30 text-ink"
        aria-label="Next image"
        onClick={() => onIndex((index + 1) % GALLERY.length)}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
