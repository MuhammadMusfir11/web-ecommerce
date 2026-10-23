import { motion } from "framer-motion";
import { Search, Tag } from "lucide-react";

export const sortOptions = [
  { value: "rekomendasi", label: "Rekomendasi" },
  { value: "termurah", label: "Harga terendah" },
  { value: "termahal", label: "Harga tertinggi" },
  { value: "nama", label: "Nama A-Z" },
];

export default function FilterBar({
  categories,
  kategori,
  onKategori,
  q,
  onQ,
  sort,
  onSort,
  promo,
  onPromo,
  count,
}) {
  const chips = ["Semua", ...categories];

  return (
    <div className="space-y-4">
      <label className="relative block md:max-w-md">
        <span className="sr-only">Cari produk</span>
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder="Cari produk, merek, atau kategori"
          className="h-12 w-full rounded-full border border-ink/10 bg-white pl-11 pr-5 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
        />
      </label>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {chips.map((c) => {
            const active = kategori === c;
            return (
              <button
                key={c}
                onClick={() => onKategori(c)}
                aria-pressed={active}
                className={`relative shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  active ? "text-paper" : "bg-card text-ink/75 hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="chip-active"
                    transition={{ type: "spring", stiffness: 450, damping: 36 }}
                    className="absolute inset-0 rounded-full bg-ink"
                  />
                )}
                <span className="relative">{c}</span>
              </button>
            );
          })}

          <button
            onClick={() => onPromo(!promo)}
            aria-pressed={promo}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
              promo
                ? "border-accent bg-accent text-white"
                : "border-accent/40 text-accent hover:bg-accent/10"
            }`}
          >
            <Tag size={14} />
            Promo
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <p className="text-sm text-ink/60">{count} produk</p>
          <label>
            <span className="sr-only">Urutkan</span>
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              className="h-10 rounded-full border border-ink/10 bg-white px-4 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}