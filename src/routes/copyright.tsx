import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/copyright")({
  component: CopyrightPage,
});

function CopyrightPage() {
  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link to="/" className="text-sm text-ivory underline underline-offset-4">
          RENSÉ
        </Link>
        <p className="mt-12 text-xs tracking-label text-gold uppercase">Copyright</p>
        <h1 className="mt-4 text-4xl text-ivory sm:text-5xl">Belongs to Rensé Advisory</h1>
        <p className="mt-6 text-lg text-ivory">
          The Guided Healing Journal belongs to Rensé Advisory. Its words and images are the copyright of Rensé Advisory.
        </p>
        <p className="mt-6 text-lg text-ivory">
          A purchase is one personal copy of the physical journal. It does not transfer the copyright, and it does not permit copying, scanning, publishing, or selling the contents.
        </p>
        <p className="mt-6 text-lg text-ivory">
          Payment is agreement to these terms.
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
