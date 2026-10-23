import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { categories, products, formatRupiah } from "../data/products";

// Satu produk unggulan per kategori
const featured = categories
  .map((c) => products.find((p) => p.category === c && p.featured))
  .filter(Boolean);

// Animasi pembuka: satu rangkaian saat halaman dimuat
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function ProductImage({ product }) {
  const [broken, setBroken] = useState(false);
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-card">
      {broken ? (
        <div className="absolute inset-0 grid place-items-center font-display text-6xl font-bold text-ink/15">
          {initials}
        </div>
      ) : (
        <img
          src={product.image}
          alt={product.name}
          onError={() => setBroken(true)}
          className="object-contain p-3 mix-blend-multiply"
        />
      )}
    </div>
  );
}

export default function Hero({ onAddToCart }) {
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const timer = useRef();
  const product = featured[active];

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleAdd = () => {
    onAddToCart?.(product);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      <div className="grid overflow-hidden rounded-3xl bg-ink text-paper lg:grid-cols-[1.05fr_0.95fr]">
        {/* Kiri: pesan utama */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col justify-center gap-6 p-7 sm:p-12 lg:p-16"
        >
          <motion.h1
            variants={rise}
            className="max-w-xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl"
          >
            HP, laptop, dan aksesori dengan harga yang jelas.
          </motion.h1>

          <motion.p variants={rise} className="max-w-md text-base leading-relaxed text-paper/70">
            Bandingkan spesifikasi, cek stok, lalu checkout dalam beberapa langkah.
          </motion.p>

          <motion.div variants={rise} className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark active:scale-[0.97]"
            >
              Lihat semua produk
            </Link>
            <Link
              to="/products?promo=1"
              className="rounded-full border border-paper/25 px-6 py-3 text-sm font-semibold transition hover:border-paper/60 active:scale-[0.97]"
            >
              Lihat promo
            </Link>
          </motion.div>
        </motion.div>

        {/* Kanan: produk unggulan, bisa diganti lewat tab */}
        <div className="bg-white/[0.04] p-4 sm:p-8 lg:p-10">
          <div
            role="tablist"
            aria-label="Produk unggulan per kategori"
            className="mb-4 flex gap-1 overflow-x-auto rounded-full bg-white/10 p-1"
          >
            {featured.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`relative flex-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  i === active ? "text-ink" : "text-paper/70 hover:text-paper"
                }`}
              >
                {i === active && (
                  <motion.span
                    layoutId="hero-tab"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-paper"
                  />
                )}
                <span className="relative">{p.category}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={product.id}
              role="tabpanel"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-3xl bg-paper p-4 text-ink sm:p-5"
            >
              <ProductImage product={product} />

              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-semibold leading-snug">{product.name}</h2>
                  <p className="mt-1 max-w-xs text-sm leading-relaxed text-ink/60">{product.blurb}</p>
                </div>
                <p className="shrink-0 font-display text-lg font-bold">{formatRupiah(product.price)}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleAdd}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.97] ${
                    added ? "bg-ink" : "bg-accent hover:bg-accent-dark"
                  }`}
                >
                  {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                  {added ? "Ditambahkan" : "Tambah ke keranjang"}
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold transition hover:border-ink/40"
                >
                  Detail
                </Link>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}