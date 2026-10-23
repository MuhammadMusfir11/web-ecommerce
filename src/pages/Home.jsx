import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Smartphone,
  Laptop as LaptopIcon,
  Headphones,
  Plug,
  ArrowUpRight,
} from "lucide-react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../data/products";

const icons = {
  HP: Smartphone,
  Laptop: LaptopIcon,
  Audio: Headphones,
  Aksesori: Plug,
};

// Muncul pelan saat section masuk layar (sekali saja)
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function Home({ onAddToCart }) {
  const featured = products.filter((p) => p.featured);
  const promo = products.filter((p) => p.oldPrice).slice(0, 2);

  return (
    <>
      <Hero onAddToCart={onAddToCart} />

      {/* Kategori */}
      <motion.section {...reveal} className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Belanja per kategori
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = icons[c];
            const total = products.filter((p) => p.category === c).length;
            return (
              <Link
                key={c}
                to={`/products?kategori=${c}`}
                className="group relative flex h-40 flex-col justify-between overflow-hidden rounded-3xl bg-card p-5 transition-colors duration-300 hover:bg-accent hover:text-white sm:h-52 sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <Icon size={30} strokeWidth={1.6} />
                  <ArrowUpRight
                    size={22}
                    className="translate-y-1 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </div>
                <div>
                  <p className="font-display text-xl font-semibold">{c}</p>
                  <p className="text-sm opacity-60">{total} produk</p>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.section>

      {/* Produk unggulan */}
      <motion.section {...reveal} className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Produk unggulan
          </h2>
          <Link
            to="/products"
            className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
          >
            Lihat semua
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAddToCart} />
          ))}
        </div>
      </motion.section>

      {/* Promo (section gelap sebagai kontras) */}
      {promo.length > 0 && (
        <motion.section {...reveal} className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 rounded-3xl bg-ink p-6 text-paper sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Harga turun minggu ini
              </h2>
              <p className="mt-4 max-w-sm text-paper/60">
                Beberapa HP, laptop, dan aksesori sedang diskon. Stok terbatas, jadi cek sebelum kehabisan.
              </p>
              <Link
                to="/products?promo=1"
                className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark active:scale-[0.97]"
              >
                Lihat semua promo
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {promo.map((p) => (
                <div key={p.id} className="rounded-2xl bg-paper p-3 text-ink">
                  <ProductCard product={p} onAdd={onAddToCart} />
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </>
  );
}