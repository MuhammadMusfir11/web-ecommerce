import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { products, formatRupiah } from "../data/products";
import { specs as specsData, reviews as reviewsData, defaultReviews } from "../data/details";
import { useCart } from "../context/CartContext";
import Gallery from "../components/Gallery";
import ProductCard from "../components/ProductCard";

const tabs = [
  { id: "spesifikasi", label: "Spesifikasi" },
  { id: "ulasan", label: "Ulasan" },
];

function Stars({ value, size = 16 }) {
  return (
    <span className="flex" aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(value) ? "fill-accent text-accent" : "text-ink/20"}
        />
      ))}
    </span>
  );
}

function Detail({ product }) {
  const { add, maxQty } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("spesifikasi");
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const specs = specsData[product.id] ?? [];
  const reviews = reviewsData[product.id] ?? defaultReviews;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const avgText = avg.toFixed(1).replace(".", ",");
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  // Produk terkait: kategori yang sama dulu
  const related = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (b.category === product.category) - (a.category === product.category))
    .slice(0, 4);

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  const buyNow = () => {
    add(product, qty);
    navigate("/checkout");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink/50">
        <Link to="/" className="transition-colors hover:text-accent">Beranda</Link>
        <ChevronRight size={14} />
        <Link
          to={`/products?kategori=${product.category}`}
          className="transition-colors hover:text-accent"
        >
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <Gallery images={product.gallery ?? [product.image]} name={product.name} />

        <div>
          <p className="text-sm font-medium text-accent">{product.category}</p>
          <h1 className="mt-1 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <Stars value={avg} />
            <span className="font-semibold">{avgText}</span>
            <span className="text-ink/50">({reviews.length} ulasan)</span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="font-display text-3xl font-bold">{formatRupiah(product.price)}</p>
            {product.oldPrice && (
              <>
                <p className="text-base text-ink/40 line-through">{formatRupiah(product.oldPrice)}</p>
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-ink/70">{product.blurb}</p>

          <div className="mt-8">
            <p className="text-sm font-semibold">Jumlah</p>
            <div className="mt-2 inline-flex items-center rounded-full border border-ink/10 bg-white">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Kurangi jumlah"
                className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-ink/5 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-semibold" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={qty >= maxQty}
                aria-label="Tambah jumlah"
                className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-ink/5 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="mt-3 text-sm text-ink/60">
              Total:{" "}
              <span className="font-semibold text-ink">{formatRupiah(product.price * qty)}</span>
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAdd}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition active:scale-[0.97] ${
                added ? "bg-ink" : "bg-accent hover:bg-accent-dark"
              }`}
            >
              {added ? <Check size={17} /> : <ShoppingBag size={17} />}
              {added ? "Ditambahkan" : "Tambah ke keranjang"}
            </button>
            <button
              onClick={buyNow}
              className="flex-1 rounded-full border border-ink/15 px-6 py-3.5 text-sm font-semibold transition hover:border-ink/40 active:scale-[0.97]"
            >
              Beli sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Tab spesifikasi dan ulasan */}
      <div className="mt-14">
        <div role="tablist" className="flex gap-6 border-b border-ink/10">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`relative pb-3 text-sm font-semibold transition-colors ${
                tab === t.id ? "text-ink" : "text-ink/50 hover:text-ink"
              }`}
            >
              {t.label}
              {t.id === "ulasan" && <span className="ml-1 text-ink/40">({reviews.length})</span>}
              {tab === t.id && (
                <motion.span
                  layoutId="detail-tab"
                  transition={{ type: "spring", stiffness: 450, damping: 36 }}
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            role="tabpanel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-6"
          >
            {tab === "spesifikasi" ? (
              specs.length > 0 ? (
                <dl className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">
                  {specs.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[8rem_1fr] gap-4 px-5 py-3.5 text-sm sm:grid-cols-[12rem_1fr]">
                      <dt className="text-ink/50">{label}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-ink/60">Spesifikasi belum diisi.</p>
              )
            ) : (
              <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
                <div>
                  <p className="font-display text-5xl font-bold">{avgText}</p>
                  <div className="mt-2">
                    <Stars value={avg} size={18} />
                  </div>
                  <p className="mt-2 text-sm text-ink/60">dari {reviews.length} ulasan</p>
                </div>

                <ul className="space-y-4">
                  {reviews.map((r) => (
                    <li key={r.name + r.date} className="rounded-2xl bg-card p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-xs text-ink/50">{r.date}</p>
                      </div>
                      <div className="mt-1">
                        <Stars value={r.rating} size={14} />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-ink/70">{r.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Produk terkait */}
      <div className="mt-16">
        <h2 className="font-display text-2xl font-bold tracking-tight">Produk lainnya</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={add} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Produk tidak ditemukan</h1>
        <p className="mt-3 text-ink/60">Produk ini mungkin sudah tidak tersedia.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-accent"
        >
          Lihat semua produk
        </Link>
      </section>
    );
  }

  // key supaya jumlah dan tab kembali awal saat pindah ke produk lain
  return <Detail key={product.id} product={product} />;
}