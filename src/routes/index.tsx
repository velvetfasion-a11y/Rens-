import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Product } from "@/components/product";
import { SiteFooter } from "@/components/site-footer";
import { BagDialog } from "@/components/bag-dialog";
import { PayDialog } from "@/components/pay-dialog";
import { readAtelier, useAtelier } from "@/lib/atelier";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const hydrate = useAtelier((state) => state.hydrate);

  useEffect(() => {
    const stored = readAtelier();
    if (stored) hydrate(stored.qty, stored.saved);
    else hydrate(0, false);
  }, [hydrate]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Product />
      </main>
      <SiteFooter />
      <BagDialog />
      <PayDialog />
    </>
  );
}
