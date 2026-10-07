export function Hero() {
  return (
    <section id="top" className="relative min-h-svh">
      <img
        src="/images/hero.jpg"
        alt="Burgundy silk, a lit candle, dried rose petals, and a brass singing bowl."
        width={1792}
        height={1008}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink/45 via-ink/10 to-ink" />
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-6 text-center">
        <p className="text-xs tracking-label text-gold uppercase">A Private Transformation</p>
        <h1 className="mt-5 text-7xl text-ivory sm:text-8xl md:text-9xl">RENSÉ</h1>
        <p className="mt-4 text-2xl text-balance text-ivory italic sm:text-3xl">Guided Healing Journal</p>
      </div>
    </section>
  );
}
