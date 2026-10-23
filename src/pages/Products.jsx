import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { products, categories } from "../data/products";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";

export default function Products({ onAddToCart }) {
  // Semua filter disimpan di URL, jadi bisa di-bookmark dan tombol Back berfungsi
  const [params, setParams] = useSearchParams();
  const kategori = params.get("kategori") || "Semua";
  const q = params.get("q") || "";
  const sort = params.get("sort") || "rekomendasi";
  const promo = params.get("promo") === "1";

  const setParam = (key, value, defaultValue) => {
    const next = new URLSearchParams(params);
    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();

    let result = products.filter((p) => {
      if (kategori !== "Semua" && p.category !== kategori) return false;
      if (promo && !p.oldPrice) return false;
      if (term) {
        const text = `${p.name} ${p.category} ${p.blurb}`.toLowerCase();
        if (!text.includes(term)) return false;
      }
      return true;
    });

    result = [...result];
    if (sort === "termurah") result.sort((a, b) => a.price - b.price);
    if (sort === "termahal") result.sort((a, b) => b.price - a.price);
    if (sort === "nama") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [kategori, q, sort, promo]);

  const reset = () => setParams({}, { replace: true });

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {q ? `Hasil untuk "${q}"` : promo ? "Promo" : kategori === "Semua" ? "Semua produk" : kategori}
      </h1>

      <div className="mt-6">
        <FilterBar
          categories={categories}
          kategori={kategori}
          onKategori={(v) => setParam("kategori", v, "Semua")}
          q={q}
          onQ={(v) => setParam("q", v, "")}
          sort={sort}
          onSort={(v) => setParam("sort", v, "rekomendasi")}
          promo={promo}
          onPromo={(v) => setParam("promo", v ? "1" : "", "")}
          count={list.length}
        />
      </div>

      {list.length > 0 ? (
        <motion.div
          layout
          className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <ProductCard product={p} onAdd={onAddToCart} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-card">
            <SearchX size={28} />
          </span>
          <h2 className="mt-5 font-display text-xl font-semibold">Produk tidak ditemukan</h2>
          <p className="mt-2 max-w-sm text-sm text-ink/60">
            Coba kata kunci lain atau hapus filter yang sedang aktif.
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-accent active:scale-[0.97]"
          >
            Reset filter
          </button>
        </div>
      )}
    </section>
  );
}