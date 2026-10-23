import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../data/products";

function Thumb({ product }) {
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-card">
      <span className="absolute inset-0 grid place-items-center font-display text-2xl font-bold text-ink/15">
        {initials}
      </span>
      <img
        src={product.image}
        alt={product.name}
        onError={(e) => (e.currentTarget.style.display = "none")}
        className="relative h-full w-full object-contain p-2"
      />
    </div>
  );
}

export default function Cart() {
  const { items, count, total, setQty, remove, clear, maxQty } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-card">
          <ShoppingBag size={34} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Keranjang masih kosong</h1>
        <p className="mt-3 max-w-sm text-ink/60">Pilih produk dulu, nanti muncul di sini.</p>
        <Link
          to="/products"
          className="mt-8 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark active:scale-[0.97]"
        >
          Belanja sekarang
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Keranjang <span className="text-ink/40">({count})</span>
        </h1>
        <button
          onClick={clear}
          className="text-sm font-medium text-ink/50 underline-offset-4 transition hover:text-accent hover:underline"
        >
          Kosongkan keranjang
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          <AnimatePresence initial={false}>
            {items.map(({ product, qty }) => (
              <motion.li
                key={product.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.25 }}
                className="flex gap-4 py-5"
              >
                <Link to={`/product/${product.id}`}>
                  <Thumb product={product} />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-ink/50">{product.category}</p>
                      <Link
                        to={`/product/${product.id}`}
                        className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-accent sm:text-base"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm text-ink/60">{formatRupiah(product.price)}</p>
                    </div>
                    <button
                      onClick={() => remove(product.id)}
                      aria-label={`Hapus ${product.name}`}
                      className="shrink-0 rounded-full p-2 text-ink/40 transition hover:bg-ink/5 hover:text-accent"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-ink/10 bg-white">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        aria-label="Kurangi jumlah"
                        className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-ink/5"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(product.id, qty + 1)}
                        disabled={qty >= maxQty}
                        aria-label="Tambah jumlah"
                        className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-ink/5 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <p className="font-display text-base font-bold sm:text-lg">
                      {formatRupiah(product.price * qty)}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <aside className="rounded-3xl bg-card p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold">Ringkasan</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal ({count} barang)</dt>
              <dd className="font-medium">{formatRupiah(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Ongkos kirim</dt>
              <dd className="text-ink/60">Dihitung di checkout</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-5">
            <span className="font-semibold">Total</span>
            <motion.span
              key={total}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-2xl font-bold"
            >
              {formatRupiah(total)}
            </motion.span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block rounded-full bg-accent py-3.5 text-center text-sm font-semibold text-white transition hover:bg-accent-dark active:scale-[0.97]"
          >
            Lanjut ke checkout
          </Link>
          <Link
            to="/products"
            className="mt-3 block py-2 text-center text-sm font-medium text-ink/60 transition hover:text-ink"
          >
            Lanjut belanja
          </Link>
        </aside>
      </div>
    </section>
  );
}