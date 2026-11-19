import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Heart, ShoppingBag, House, LayoutGrid, Tag } from "lucide-react";

const links = [
  { label: "Semua Produk", href: "/products" },
  { label: "HP", href: "/products?kategori=HP" },
  { label: "Laptop", href: "/products?kategori=Laptop" },
  { label: "Audio", href: "/products?kategori=Audio" },
  { label: "Aksesori", href: "/products?kategori=Aksesori" },
  { label: "Promo", href: "/products?promo=1", highlight: true },
];

function CartBadge({ count }) {
  if (count <= 0) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 1.7 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white"
    >
      {count}
    </motion.span>
  );
}

export default function Navbar({ cartCount = 0, onCartClick }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const current = pathname + search;

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/products?q=${encodeURIComponent(q.trim())}`);
    setQ("");
  };

  const tabs = [
    { label: "Beranda", to: "/", icon: House, active: pathname === "/" },
    {
      label: "Produk",
      to: "/products",
      icon: LayoutGrid,
      active: pathname.startsWith("/products") && !search.includes("promo"),
    },
    { label: "Promo", to: "/products?promo=1", icon: Tag, active: search.includes("promo") },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/5 bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2 font-display text-lg font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-base text-white">W</span>
            <span className="hidden sm:block">Wali Cell</span>
          </Link>

          {/* Menu kategori (laptop) */}
          <nav aria-label="Kategori" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map((l) => {
                const active = current === l.href;
                return (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className={`block rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-accent-soft text-accent"
                          : l.highlight
                            ? "text-accent hover:bg-accent-soft"
                            : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <form role="search" onSubmit={submit} className="relative flex-1 lg:ml-auto lg:w-80 lg:flex-none">
            <label>
              <span className="sr-only">Cari produk</span>
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari produk atau merek"
                className="h-11 w-full rounded-full bg-white pl-11 pr-4 text-sm shadow-sm ring-1 ring-ink/5 outline-none transition placeholder:text-ink/40 focus:ring-2 focus:ring-accent/50"
              />
            </label>
          </form>

          <div className="flex items-center gap-1">
            <button
              aria-label="Wishlist"
              className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5 sm:grid"
            >
              <Heart size={20} />
            </button>

            <button
              onClick={onCartClick}
              aria-label={`Keranjang, ${cartCount} barang`}
              className="relative hidden h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5 lg:grid"
            >
              <ShoppingBag size={20} />
              <CartBadge count={cartCount} />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom navigation (HP) */}
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/5 bg-white/95 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {tabs.map(({ label, to, icon: Icon, active }) => (
            <li key={label}>
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                  active ? "text-accent" : "text-ink/55"
                }`}
              >
                <Icon size={21} strokeWidth={active ? 2.4 : 1.9} />
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={onCartClick}
              aria-label={`Keranjang, ${cartCount} barang`}
              className="relative flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-ink/55"
            >
              <span className="relative">
                <ShoppingBag size={21} strokeWidth={1.9} />
                <CartBadge count={cartCount} />
              </span>
              Keranjang
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
