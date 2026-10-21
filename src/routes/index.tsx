import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BagDialog } from "@/components/bag-dialog";
import { HomePage } from "@/components/home-page";
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
      <HomePage />
      <BagDialog />
      <PayDialog />
    </>
  );
}
