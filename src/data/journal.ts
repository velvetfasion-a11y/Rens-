export const JOURNAL = {
  name: "Guided Healing Journal",
  price: 249,
} as const;

export type Review = {
  id: string;
  name: string;
  place: string;
  rating: number;
  quote: string;
};

export const reviews: Review[] = [
  {
    id: "ameli",
    name: "Ameli",
    place: "Stockholm",
    rating: 5,
    quote: "The amount of epiphanies I have gotten is insane I take this journal with me everywhere",
  },
  {
    id: "vanessa",
    name: "Vanessa",
    place: "Stockholm",
    rating: 5,
    quote: "I love it so much",
  },
  {
    id: "josephine",
    name: "Josephine",
    place: "Stockholm",
    rating: 5,
    quote: "From the bottom of my heart, thank you for creating this",
  },
  {
    id: "shila",
    name: "Shila",
    place: "Stockholm",
    rating: 5,
    quote: "Having the book always there makes me want to heal, even if I am ignoring the pain",
  },
  {
    id: "maria",
    name: "Maria",
    place: "Stockholm",
    rating: 5,
    quote: "I thought I would stop using this book, but this is Actually than my weekly therapy sessions",
  },
  {
    id: "camille",
    name: "Camille",
    place: "Malmö",
    rating: 5,
    quote: "One word, Magical",
  },
  {
    id: "elise",
    name: "Elise",
    place: "Stockholm",
    rating: 5,
    quote: "I’ve never had more easy way to healing in my entire life",
  },
  {
    id: "ingrid",
    name: "Ingrid",
    place: "Sundsvall",
    rating: 5,
    quote: "10/10 recommend",
  },
  {
    id: "frida",
    name: "Frida",
    place: "Stockholm",
    rating: 5,
    quote: "This book has 10x my life! Strongly recommend!",
  },
];

export function averageRating(list: Review[] = reviews) {
  const sum = list.reduce((total, review) => total + review.rating, 0);
  return (sum / list.length).toFixed(1);
}

export function formatPrice(amount: number) {
  return `${amount}\u00a0kr`;
}

export const SHIPPING = {
  sweden: 59,
  international: 99,
  freeFrom: 3,
} as const;

export type ShipRegion = "" | "sweden" | "europe" | "world";

export function shippingCost(qty: number, region: ShipRegion) {
  if (!region) return null;
  if (qty >= SHIPPING.freeFrom) return 0;
  return region === "sweden" ? SHIPPING.sweden : SHIPPING.international;
}

export function shippingDays(region: ShipRegion) {
  if (region === "sweden") return "1–4 business days";
  if (region === "europe") return "2–7 business days";
  return null;
}
