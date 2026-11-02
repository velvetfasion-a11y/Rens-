import { useEffect, useRef, useState, type FormEvent } from "react";
import { ProductView } from "@/components/product-view";
import { SiteChrome } from "@/components/site-chrome";
import { getJournalSaleCapState } from "@/lib/inventory";
import {
  SUBSCRIBE_SECTION_ID,
  ZOHO_CIRCLE_OPTIN_ACTION,
  ZOHO_CIRCLE_OPTIN_HIDDEN,
} from "@/lib/subscribe";

export function HomePage() {
  const [addLabel, setAddLabel] = useState("Add to bag");

  useEffect(() => {
    void getJournalSaleCapState().then((state) => {
      if (state.atCap) setAddLabel("Preorder");
    });
  }, []);

  return (
    <SiteChrome>
      <main>
        <section id="top" className="relative mt-16 h-[calc(88svh-4rem)] overflow-hidden bg-white">
          <HeroFilm />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-b from-transparent via-black/20 to-black/65" />
          <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-14 text-left sm:px-10 sm:pb-16 lg:px-16 lg:pb-16">
            <h1 className="text-[2.75rem] leading-[1.02] font-normal text-white italic sm:text-6xl">
              The life
              <br />
              you desire.
            </h1>
            <a
              href="#product"
              className="mt-6 text-[11px] tracking-[0.28em] text-white uppercase underline decoration-white underline-offset-[10px]"
            >
              Get the journal
            </a>
          </div>
        </section>

        <ProductView bagLabel={addLabel} />

        <section className="bg-white px-6 pt-4 pb-2 text-center">
          <p className="text-[11px] tracking-[0.42em] text-gold uppercase">Given</p>
          <p className="mx-auto mt-4 max-w-sm font-serif text-[1.35rem] leading-snug text-ink">
            40% of the profit is given to children without parents.
          </p>
        </section>

        <section className="bg-white">
          <section
            id="about"
            className="relative overflow-hidden bg-white px-6 pt-20 pb-16 text-center sm:pt-24 lg:pt-28 lg:pb-20"
          >
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
                Rensé believes
              </span>
              <span className="block text-[clamp(1.85rem,7.6vw,4.5rem)] leading-[1.08] whitespace-nowrap">
                limitations can
              </span>
              <span className="block text-[clamp(1.85rem,7.6vw,4.5rem)] leading-[1.08] whitespace-nowrap text-gold italic">
                be overcome.
              </span>
            </h2>
            <span className="relative mx-auto mt-7 block h-px w-12 bg-gold lg:mt-8" />
            <div className="relative mx-auto mt-9 max-w-[34rem] space-y-7 font-serif text-[1.15rem] leading-[1.7] text-[#5c564e] sm:max-w-2xl sm:text-lg lg:mt-10 lg:max-w-3xl lg:space-y-5 lg:text-[1.05rem] lg:leading-relaxed">
              <p>
                There is usually one situation
                <br className="sm:hidden" /> behind the life you do not want.
              </p>
              <p>
                Write it down. Answer honestly.
                <br className="sm:hidden" /> Then live what you find.
              </p>
            </div>
            <p className="relative mt-10 inline-block text-[11px] tracking-[0.38em] text-ink uppercase lg:mt-12">
              Read our story <span aria-hidden="true">→</span>
              <span className="mt-2 block h-px w-full bg-gold" />
            </p>
          </section>
        </section>

        <Circle />
      </main>
    </SiteChrome>
  );
}

function Circle() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const zohoEmailRef = useRef<HTMLInputElement>(null);
  const zohoFormRef = useRef<HTMLFormElement>(null);

  function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = email.trim();
    if (!next.includes("@") || !next.includes(".")) return;
    if (zohoEmailRef.current) zohoEmailRef.current.value = next;
    zohoFormRef.current?.requestSubmit();
    setDone(true);
  }

  return (
    <section
      id={SUBSCRIBE_SECTION_ID}
      className="scroll-mt-16 bg-[#f6e8e4] px-6 py-16 text-center sm:py-20"
    >
      <h2 className="font-display text-3xl text-ink sm:text-4xl">Join the circle</h2>
      <p className="mt-3 font-serif text-base text-mute italic">Private releases, by email.</p>
      <iframe
        name="rense-zoho-circle"
        title=""
        className="pointer-events-none absolute h-0 w-0 border-0 opacity-0"
        tabIndex={-1}
      />
      <form
        ref={zohoFormRef}
        action={ZOHO_CIRCLE_OPTIN_ACTION}
        method="POST"
        target="rense-zoho-circle"
        className="hidden"
        aria-hidden="true"
      >
        <input ref={zohoEmailRef} type="hidden" name="CONTACT_EMAIL" defaultValue="" />
        {Object.entries(ZOHO_CIRCLE_OPTIN_HIDDEN).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      </form>
      {done ? (
        <p className="mt-8 text-sm text-mute">You&apos;re on the list.</p>
      ) : (
        <form
          className="mx-auto mt-8 flex w-full max-w-xs items-center border-b border-ink/25"
          onSubmit={join}
        >
          <input
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            enterKeyHint="done"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            aria-label="Email"
            className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-[#a39b93]"
          />
          <button type="submit" className="press h-11 shrink-0 text-[11px] tracking-[0.22em] text-ink uppercase">
            Join
          </button>
        </form>
      )}
    </section>
  );
}

function HeroFilm() {
  return (
    <>
      <img
        src="/images/hero-portrait.jpg"
        alt="A woman holding the Guided Healing Journal in a quiet hotel lounge."
        className="absolute inset-0 h-full w-full object-cover object-[center_22%] lg:hidden"
      />
      <img
        src="/images/hero-wide.jpg"
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover object-[center_40%] lg:block"
      />
    </>
  );
}
