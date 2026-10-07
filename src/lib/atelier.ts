import { create } from "zustand";

const KEY = "rense-atelier";

type AtelierState = {
  qty: number;
  saved: boolean;
  bagOpen: boolean;
  payOpen: boolean;
  hydrated: boolean;
  add: () => void;
  setQty: (qty: number) => void;
  toggleSaved: () => void;
  setBagOpen: (open: boolean) => void;
  setPayOpen: (open: boolean) => void;
  hydrate: (qty: number, saved: boolean) => void;
};

function write(qty: number, saved: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ qty, saved }));
  } catch {
    /* private mode */
  }
}

export const useAtelier = create<AtelierState>((set, get) => ({
  qty: 0,
  saved: false,
  bagOpen: false,
  payOpen: false,
  hydrated: false,
  add: () => {
    const qty = get().qty + 1;
    set({ qty, bagOpen: true });
    write(qty, get().saved);
  },
  setQty: (next) => {
    const qty = Math.max(0, next);
    set({ qty });
    write(qty, get().saved);
  },
  toggleSaved: () => {
    const saved = !get().saved;
    set({ saved });
    write(get().qty, saved);
  },
  setBagOpen: (bagOpen) => set({ bagOpen }),
  setPayOpen: (payOpen) => set({ payOpen }),
  hydrate: (qty, saved) => set({ qty, saved, hydrated: true }),
}));

export function readAtelier() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { qty: 0, saved: false };
    const data = JSON.parse(raw) as { qty?: unknown; saved?: unknown };
    return {
      qty: typeof data.qty === "number" && data.qty >= 0 ? Math.floor(data.qty) : 0,
      saved: Boolean(data.saved),
    };
  } catch {
    return null;
  }
}
