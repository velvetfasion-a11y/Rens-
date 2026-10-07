import { Star } from "lucide-react";

export function Stars() {
  return (
    <span className="inline-flex gap-1 text-gold" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className="size-3.5 fill-current" strokeWidth={1} />
      ))}
    </span>
  );
}
