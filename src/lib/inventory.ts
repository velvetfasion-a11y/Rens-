import { createServerFn } from "@tanstack/react-start";
import { JOURNAL_SALE_CAP } from "@/data/journal";

async function journalUnitsSold(): Promise<number> {
  if (!process.env.DATABASE_URL?.trim()) return 0;
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{ total: number }>`select coalesce(sum(qty), 0)::int as total from orders`;
  return rows[0]?.total ?? 0;
}

export const getJournalSaleCapState = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sold = await journalUnitsSold();
    return { sold, atCap: sold >= JOURNAL_SALE_CAP };
  } catch (err) {
    console.error("[getJournalSaleCapState]", err);
    return { sold: 0, atCap: false };
  }
});
