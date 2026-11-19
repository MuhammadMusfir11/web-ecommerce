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
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-card sm:h-28 sm:w-28 lg:aspect-[4/3] lg:h-auto lg:w-full lg:rounded-2xl">
      {broken ? (
        <div className="absolute inset-0 grid place-items-center font-display text-4xl font-bold text-ink/15 lg:text-6xl">
          {initials}
        </div>
      ) : (
        <img
          src={product.image}
          alt={product.name}
          onError={() => setBroken(true)}
          className="h-full w-full object-contain p-2 mix-blend-multiply lg:p-3"
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
    <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-dark via-accent to-[#5aa9ff] text-white">
        {/* Lingkaran dekoratif */}
        <span aria-hidden="true" className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <span aria-hidden="true" className="absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-white/[0.07]" />

        <div className="relative grid items-center gap-6 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:p-14">
          {/* Kiri: pesan utama */}
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4 lg:gap-6">
            <motion.span
              variants={rise}
              className="w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur"
            >
              Stok terbaru
            </motion.span>

            <motion.h1
              variants={rise}
              className="max-w-xl font-display text-[1.7rem] font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl"
            >
              HP, laptop, dan aksesori dengan harga yang jelas.
            </motion.h1>

            <motion.p variants={rise} className="max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
              Bandingkan spesifikasi, cek stok, lalu checkout dalam beberapa langkah.
            </motion.p>

            <motion.div variants={rise} className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-accent-dark shadow-lg shadow-accent-dark/30 transition hover:bg-accent-soft active:scale-[0.97]"
              >
                Lihat semua produk
              </Link>
              <Link
                to="/products?promo=1"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold transition hover:bg-white/10 active:scale-[0.97]"
              >
                Lihat promo
              </Link>
            </motion.div>
          </motion.div>

          {/* Kanan: produk unggulan, ganti lewat titik di bawah */}
          <AnimatePresence mode="wait">
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              aria-live="polite"
              className="flex gap-4 rounded-3xl bg-white p-3 text-ink shadow-xl shadow-accent-dark/20 sm:p-4 lg:flex-col lg:p-5"
            >
              <ProductImage product={product} />

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-accent">{product.category}</p>
                  <h2 className="mt-0.5 font-display text-base font-semibold leading-snug lg:text-lg">{product.name}</h2>
                  <p className="mt-1 hidden text-sm leading-relaxed text-ink/60 sm:block">{product.blurb}</p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-base font-bold lg:text-lg">{formatRupiah(product.price)}</p>
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="hidden rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold transition hover:border-ink/40 sm:block"
                    >
                      Detail
                    </Link>
                    <button
                      onClick={handleAdd}
                      aria-label={added ? "Ditambahkan ke keranjang" : `Tambah ${product.name} ke keranjang`}
                      className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition active:scale-[0.97] ${
                        added ? "bg-ink" : "bg-accent hover:bg-accent-dark"
                      }`}
                    >
                      {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                      <span className="hidden sm:inline">{added ? "Ditambahkan" : "Tambah"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Titik pilihan produk unggulan */}
        <div role="tablist" aria-label="Produk unggulan per kategori" className="relative flex gap-2 px-6 pb-5 sm:px-10 lg:px-14 lg:pb-8">
          {featured.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={i === active}
              aria-label={`Unggulan ${p.category}`}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
