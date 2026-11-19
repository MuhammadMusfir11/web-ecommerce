import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../data/products";

function Thumb({ product }) {
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-card">
      <span className="absolute inset-0 grid place-items-center font-display text-xl font-bold text-ink/15">
        {initials}
      </span>
      <img
        src={product.image}
        alt={product.name}
        onError={(e) => (e.currentTarget.style.display = "none")}
        className="relative h-full w-full object-contain p-2 mix-blend-multiply"
      />
    </div>
  );
}

export default function CartDrawer({ open, onClose }) {
  const { items, count, total, setQty, remove, maxQty } = useCart();

  // Esc untuk menutup, dan halaman di belakang tidak ikut ter-scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
        />
      )}

      {open && (
        <motion.aside
          key="panel"
          role="dialog"
          aria-modal="true"
          aria-label="Keranjang belanja"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-paper shadow-2xl sm:rounded-l-3xl"
        >
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-display text-lg font-bold">
              Keranjang{count > 0 && <span className="ml-1.5 text-accent">({count})</span>}
            </h2>
            <button
              onClick={onClose}
              aria-label="Tutup keranjang"
              className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm ring-1 ring-ink/5 transition hover:bg-ink/5"
            >
              <X size={20} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent">
                <ShoppingBag size={28} />
              </span>
              <p className="mt-5 font-display text-lg font-semibold">Keranjang masih kosong</p>
              <p className="mt-2 text-sm text-ink/60">Pilih produk dulu, nanti muncul di sini.</p>
              <Link
                to="/products"
                onClick={onClose}
                className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark active:scale-[0.97]"
              >
                Belanja sekarang
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
                <AnimatePresence initial={false}>
                  {items.map(({ product, qty }) => (
                    <motion.li
                      key={product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-ink/5"
                    >
                      <Thumb product={product} />

                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${product.id}`}
                            onClick={onClose}
                            className="line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-accent"
                          >
                            {product.name}
                          </Link>
                          <button
                            onClick={() => remove(product.id)}
                            aria-label={`Hapus ${product.name}`}
                            className="shrink-0 rounded-full p-1.5 text-ink/40 transition hover:bg-sale/10 hover:text-sale"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center rounded-full bg-card">
                            <button
                              onClick={() => setQty(product.id, qty - 1)}
                              aria-label="Kurangi jumlah"
                              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-ink/5"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold" aria-live="polite">
                              {qty}
                            </span>
                            <button
                              onClick={() => setQty(product.id, qty + 1)}
                              disabled={qty >= maxQty}
                              aria-label="Tambah jumlah"
                              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-ink/5 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="font-display text-sm font-bold">
                            {formatRupiah(product.price * qty)}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="rounded-t-3xl bg-white px-5 pb-5 pt-5 shadow-[0_-8px_24px_-12px] shadow-ink/15">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink/60">Subtotal</span>
                  <motion.span
                    key={total}
                    initial={{ opacity: 0.4, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-xl font-bold"
                  >
                    {formatRupiah(total)}
                  </motion.span>
                </div>
                <p className="mt-1 text-xs text-ink/50">Ongkos kirim dihitung saat checkout.</p>

                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="mt-4 block rounded-2xl bg-accent py-3.5 text-center text-sm font-semibold text-white transition hover:bg-accent-dark active:scale-[0.98]"
                >
                  Checkout ({count})
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="mt-2 block rounded-2xl py-3 text-center text-sm font-semibold text-accent transition hover:bg-accent-soft"
                >
                  Lihat keranjang
                </Link>
              </div>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
